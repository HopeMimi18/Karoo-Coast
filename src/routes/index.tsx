import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { STOPS, THREADS, type Stop, type Thread } from "@/data/stops";
import { LANGS, t, type Lang } from "@/lib/i18n";
import {
  TOTAL_KM,
  clockAtKm,
  currentStop,
  dayAtKm,
  daylightAtKm,
  elapsedLabel,
  fmtKm,
  nextStop,
  passed,
} from "@/lib/journey";
import StoryPanel from "@/components/StoryPanel";
import Timeline from "@/components/Timeline";

const JourneyMap = lazy(() => import("@/components/JourneyMap"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Track 1067 — Ride the Pretoria to Cape Town rail line" },
      {
        name: "description",
        content:
          "An interactive, animated, multilingual map of the 1 546 km Cape main line: 28 stops and passing moments, real OpenStreetMap rail geometry, and the stories along the way.",
      },
      { property: "og:title", content: "Track 1067 — Pretoria to Cape Town by rail" },
      {
        property: "og:description",
        content:
          "Ride the Cape main line in real time. Diamonds, water, names and conflict across 1 546 km of South Africa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Journey,
});

const SPEEDS = [
  { label: "1×", v: 1 },
  { label: "250×", v: 250 },
  { label: "900×", v: 900 },
  { label: "3 000×", v: 3000 },
];

function Journey() {
  const [km, setKm] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [lang, setLang] = useState<Lang>("en");
  const [follow, setFollow] = useState(true);
  const [filter, setFilter] = useState<Thread | "all">("all");
  const [manual, setManual] = useState<Stop | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [started, setStarted] = useState(false);

  // Journey clock: 1 546 km over 26 hours, scaled by speed.
  const raf = useRef<number | null>(null);
  const last = useRef<number>(0);
  useEffect(() => {
    if (!playing) return;
    last.current = performance.now();
    const tick = (now: number) => {
      const dt = (now - last.current) / 1000;
      last.current = now;
      setKm((prev) => {
        const kmPerSec = (TOTAL_KM / (26 * 3600)) * speed;
        const next = prev + kmPerSec * dt;
        if (next >= TOTAL_KM) {
          setPlaying(false);
          return TOTAL_KM;
        }
        return next;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [playing, speed]);

  const auto = currentStop(km);
  const active = manual ?? auto;
  const upcoming = nextStop(km);
  const light = daylightAtKm(km);
  const night = light < 0.4;

  // The interface follows the sun.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", night);
  }, [night]);

  // Clear the manual override once the train catches up with it.
  useEffect(() => {
    if (manual && Math.abs(manual.km - km) < 3) setManual(null);
  }, [km, manual]);

  const log = useMemo(() => {
    const seen = passed(km);
    return filter === "all" ? seen : seen.filter((s) => s.threads.includes(filter));
  }, [km, filter]);

  const speak = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    const lead =
      lang === "af" ? active.lead_af ?? active.lead : lang === "xh" ? active.lead_xh ?? active.lead : active.lead;
    const u = new SpeechSynthesisUtterance(`${active.name}. ${lead} ${active.body}`);
    const voice = window.speechSynthesis
      .getVoices()
      .find((v) => v.lang?.toLowerCase().startsWith(LANGS.find((l) => l.id === lang)!.speech.slice(0, 2)));
    if (voice) u.voice = voice;
    u.rate = 0.95;
    u.onend = () => setSpeaking(false);
    synth.speak(u);
    setSpeaking(true);
  }, [active, lang]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  const depart = () => {
    setStarted(true);
    setPlaying(true);
  };

  const stopCount = STOPS.filter((s) => s.kind === "stop").length;

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-background text-foreground">
      {/* Map */}
      <div className="absolute inset-0">
        <ClientOnly fallback={<div className="h-full w-full bg-muted/30" />}>
          <Suspense fallback={<div className="h-full w-full bg-muted/30" />}>
            <JourneyMap
              km={km}
              follow={follow}
              night={night}
              activeId={active.id}
              onSelect={(s) => {
                setManual(s);
                setKm(s.km);
              }}
            />
          </Suspense>
        </ClientOnly>
      </div>

      {/* Night wash */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-1000"
        style={{
          opacity: 1 - light,
          background:
            "radial-gradient(120% 80% at 50% 0%, oklch(0.2 0.05 265 / 0.25), oklch(0.09 0.03 265 / 0.72))",
        }}
      />

      {/* Header */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-wrap items-start justify-between gap-3 p-4 sm:p-5">
        <div className="pointer-events-auto rounded-sm border border-border bg-card/85 px-4 py-3 backdrop-blur-md">
          <h1 className="text-2xl leading-none">
            Track <span className="text-primary">1067</span>
          </h1>
          <p className="mt-1 max-w-[22rem] text-[11px] leading-tight text-muted-foreground">
            {t(lang, "subtitle")}
          </p>
          <nav className="mt-2 flex gap-3 text-[11px]">
            <Link to="/guide" className="text-primary underline-offset-4 hover:underline">
              {t(lang, "guide")}
            </Link>
            <Link to="/threads" className="text-primary underline-offset-4 hover:underline">
              {t(lang, "threads")}
            </Link>
            <Link to="/about" className="text-primary underline-offset-4 hover:underline">
              {t(lang, "about")}
            </Link>
          </nav>
        </div>

        <div className="pointer-events-auto flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 rounded-sm border border-border bg-card/85 px-3 py-2 font-mono text-xs backdrop-blur-md">
            <span className="text-sand">{clockAtKm(km)}</span>
            <span className="text-dust">day {dayAtKm(km)}</span>
            <span className="h-3 w-px bg-border" />
            <span className={night ? "text-thread-water" : "text-primary"}>
              {night ? t(lang, "night") : t(lang, "day")}
            </span>
          </div>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
            aria-label={t(lang, "language")}
            className="rounded-sm border border-border bg-card/85 px-2 py-1.5 text-xs backdrop-blur-md"
          >
            {LANGS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.native}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 rounded-sm border border-border bg-card/85 px-2 py-1.5 text-[11px] backdrop-blur-md">
            <input type="checkbox" checked={follow} onChange={(e) => setFollow(e.target.checked)} />
            follow the train
          </label>
        </div>
      </header>

      {/* Story rail */}
      <section className="absolute inset-x-0 bottom-[8.5rem] top-auto z-20 max-h-[52dvh] overflow-y-auto px-4 sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[27rem] sm:px-0">
        <div className="h-full border border-border bg-card/92 p-5 backdrop-blur-md sm:border-y-0 sm:border-r-0 sm:overflow-y-auto sm:pt-28 sm:pb-44">
          <StoryPanel stop={active} lang={lang} speaking={speaking} onSpeak={speak} />

          {upcoming && (
            <p className="mt-6 hairline pt-4 font-mono text-[11px] text-muted-foreground">
              {t(lang, "nextUp")}: <span className="text-sand">{upcoming.name}</span> ·{" "}
              {fmtKm(Math.max(0, upcoming.km - km))} · {clockAtKm(upcoming.km)}
            </p>
          )}

          <div className="mt-6 hidden sm:block">
            <p className="mono-label mb-2 text-dust">{t(lang, "journeyLog")}</p>
            <ul className="space-y-1">
              {log.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => {
                      setManual(s);
                      setKm(s.km);
                    }}
                    className={`flex w-full items-baseline justify-between gap-2 py-0.5 text-left text-xs hover:text-primary ${
                      s.id === active.id ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <span className="truncate">{s.name}</span>
                    <span className="font-mono text-[10px] text-dust">{Math.round(s.km)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Controls */}
      <footer className="absolute inset-x-0 bottom-0 z-30 border-t border-border bg-card/90 px-4 py-3 backdrop-blur-md sm:pr-[28rem]">
        <Timeline km={km} onScrub={(v) => { setKm(v); setManual(null); }} activeId={active.id} lang={lang} />

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={() => (playing ? setPlaying(false) : depart())}
            className="rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            {playing ? t(lang, "pause") : started ? t(lang, "ride") : t(lang, "play")}
          </button>
          <button
            onClick={() => {
              setKm(0);
              setManual(null);
              setPlaying(false);
            }}
            className="rounded-sm border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
          >
            {t(lang, "restart")}
          </button>

          <div className="flex items-center gap-1">
            {SPEEDS.map((s) => (
              <button
                key={s.v}
                onClick={() => setSpeed(s.v)}
                className={`rounded-sm border px-2 py-1 font-mono text-[11px] ${
                  speed === s.v
                    ? "border-primary text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
            <span>
              {t(lang, "distance")} <span className="text-sand">{fmtKm(km)}</span> / {fmtKm(TOTAL_KM)}
            </span>
            <span className="hidden sm:inline">
              {t(lang, "elapsed")} <span className="text-sand">{elapsedLabel(km)}</span>
            </span>
            <span className="hidden lg:inline">
              {stopCount} {t(lang, "stops")} · {STOPS.length - stopCount} passing
            </span>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-full border px-2.5 py-1 text-[11px] ${
              filter === "all" ? "border-primary text-primary" : "border-border text-muted-foreground"
            }`}
          >
            {t(lang, "allThreads")}
          </button>
          {THREADS.map((th) => (
            <button
              key={th.id}
              onClick={() => setFilter(filter === th.id ? "all" : th.id)}
              className="rounded-full border px-2.5 py-1 text-[11px] transition-opacity"
              style={{
                borderColor: th.color,
                color: th.color,
                opacity: filter === "all" || filter === th.id ? 1 : 0.4,
              }}
            >
              {th.label}
            </button>
          ))}
        </div>
      </footer>
    </main>
  );
}
