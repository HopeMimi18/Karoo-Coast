import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { STOPS, THREADS } from "@/data/stops";
import { MAX_POINTS, QUESTIONS } from "@/data/quiz";
import { TOTAL_KM, fmtKm } from "@/lib/journey";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import SiteHeader from "@/components/SiteHeader";
import heroTrain from "@/assets/hero-train.jpg";
import biomeGariep from "@/assets/biome-gariep.jpg";
import biomeKaroo from "@/assets/biome-karoo.jpg";
import biomeFynbos from "@/assets/biome-fynbos.jpg";
import trainInterior from "@/assets/train-interior.jpg";

const BIOMES = [
  {
    img: biomeGariep,
    alt: "A real photograph of a bridge crossing the Orange River in South Africa",
    km: "around km 660 · !Gariep / Orange River",
    title: "The Orange River crossing",
    body: "One of the big threshold moments on the route: the line reaches the country's great river and opens into the long distances of the Northern Cape.",
  },
  {
    img: biomeKaroo,
    alt: "A real photograph of a road and scrub landscape in the Great Karoo",
    km: "around km 950 · Great Karoo",
    title: "Great Karoo",
    body: "Dry air, open horizons and huge skies define the middle of the journey — the slow, quiet heart of the South African interior.",
  },
  {
    img: biomeFynbos,
    alt: "A real photograph of the Hex River Valley and surrounding mountains",
    km: "around km 1 380 · Hex River Valley",
    title: "Hex River & the winelands gateway",
    body: "Mountain walls, vineyards and dramatic passes mark the approach into the Cape — one of the most scenic sections of the whole line.",
  },
  {
    img: trainInterior,
    alt: "A real photograph of the interior of a South African passenger coach",
    km: "on board · the travel experience",
    title: "Life in the coach",
    body: "The journey is not only about destinations. Window seats, carriage conversations and the rhythm of the track are part of the experience too.",
  },
] as const;


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Karoo & Coast — interactive Pretoria to Cape Town rail journey" },
      {
        name: "description",
        content:
          "A digital rail journey companion for Pretoria to Cape Town: animated mapping, route-aware WindowCast storytelling, station tourism discovery, multilingual content and a digital passport.",
      },
      { property: "og:title", content: "Karoo & Coast — ride, plan, collect, share" },
      {
        property: "og:description",
        content: "An interactive rail tourism companion for the Pretoria-to-Cape Town journey corridor.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const CARDS = [
  {
    to: "/journey",
    kicker: "01",
    title: "Ride the line",
    body: "Journey Intelligence, GPS route matching and WindowCast alerts bring the route to life as landmarks and stories approach.",
  },
  {
    to: "/plan",
    kicker: "02",
    title: "Plan your trip",
    body: "Pick the stops and interests that matter to you and build a saved itinerary with distances and arrival times.",
  },
  {
    to: "/passport",
    kicker: "03",
    title: "Rail passport",
    body: "Collect a stamp at every station you reach. Track your progress down the line and earn journey badges.",
  },
  {
    to: "/quiz",
    kicker: "04",
    title: "Route challenge",
    body: "Ten questions drawn from the line itself — gauge, diamonds, mountains and names. Points land on the leaderboard.",
  },
  {
    to: "/stories",
    kicker: "05",
    title: "Community stories",
    body: "Add your own memory of a station and read what other travellers left behind at the same platform.",
  },
  {
    to: "/threads",
    kicker: "06",
    title: "Four threads",
    body: "Diamonds, water, names and conflict — the storylines that run the whole length of the track.",
  },
] as const;

function Home() {
  const { user, profile } = useAuth();
  const [stamps, setStamps] = useState(0);
  const [points, setPoints] = useState(0);
  const [trips, setTrips] = useState(0);
  const [board, setBoard] = useState<{ name: string; points: number }[]>([]);

  useEffect(() => {
    if (!user) {
      setStamps(0);
      setPoints(0);
      setTrips(0);
      return;
    }
    void (async () => {
      const [s, q, t] = await Promise.all([
        supabase.from("stamps").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("quiz_results").select("points").eq("user_id", user.id),
        supabase.from("trips").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);
      setStamps(s.count ?? 0);
      setPoints((q.data ?? []).reduce((sum, r) => sum + (r.points as number), 0));
      setTrips(t.count ?? 0);
    })();
  }, [user]);

  useEffect(() => {
    void (async () => {
      const { data } = await supabase.from("quiz_results").select("user_id, points");
      const { data: people } = await supabase.from("profiles").select("id, display_name");
      const names = new Map((people ?? []).map((p) => [p.id as string, p.display_name as string]));
      const totals = new Map<string, number>();
      for (const row of data ?? []) {
        const id = row.user_id as string;
        totals.set(id, (totals.get(id) ?? 0) + (row.points as number));
      }
      setBoard(
        [...totals.entries()]
          .map(([id, p]) => ({ name: names.get(id) ?? "Traveller", points: p }))
          .sort((a, b) => b.points - a.points)
          .slice(0, 5),
      );
    })();
  }, [user]);

  const stopCount = STOPS.filter((s) => s.kind === "stop").length;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />

      <section className="relative isolate overflow-hidden">
        <img
          src={heroTrain}
          alt="Real landscape photograph of the Hex River Valley near the Cape rail approach"
          width={1920}
          height={1088}
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/85 to-background/40" />
        <div className="mx-auto max-w-6xl px-5 pt-16 pb-12">
        <p className="mono-label text-dust">Geekulcha Train Tourism · Cape main line</p>

        <h1 className="mt-3 max-w-4xl text-5xl leading-[0.95] sm:text-7xl">
          Your train journey becomes <span className="text-primary">part of the destination.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Karoo & Coast is an airport-inspired digital rail companion for the {fmtKm(TOTAL_KM)} Pretoria–Cape Town
          tourism corridor — combining journey awareness with South African stories, attractions, languages and a
          route-aware WindowCast experience.
        </p>

        <div className="mt-5 flex flex-wrap gap-2 font-mono text-[10px]">
          {['Journey Intelligence', 'WindowCast™', 'Station Mode', 'GPS-ready', '5 languages'].map((label) => (
            <span key={label} className="rounded-full border border-border bg-background/45 px-2.5 py-1 text-sand">{label}</span>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to="/journey"
            className="rounded-sm bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Board the train
          </Link>
          {!user && (
            <Link to="/auth" className="rounded-sm border border-border px-5 py-2.5 text-sm hover:border-primary">
              Get your passport
            </Link>
          )}
          <Link to="/plan" className="rounded-sm border border-border px-5 py-2.5 text-sm hover:border-primary">
            Plan a trip
          </Link>
        </div>

        <dl className="mt-10 grid grid-cols-2 gap-4 border-t border-border pt-6 font-mono text-xs sm:grid-cols-4">
          {[
            [fmtKm(TOTAL_KM), "of track"],
            [`${stopCount}`, "stations"],
            [`${STOPS.length - stopCount}`, "passing moments"],
            ["5", "languages"],
          ].map(([v, k]) => (
            <div key={k}>
              <dt className="text-2xl text-sand">{v}</dt>
              <dd className="text-dust">{k}</dd>
            </div>
          ))}
        </dl>
        </div>
      </section>

      {/* Product thesis */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-5 lg:grid-cols-[1.05fr_1.95fr] lg:items-end">
          <div>
            <p className="mono-label text-dust">MOVE → DISCOVER → EXPERIENCE</p>
            <h2 className="mt-2 text-3xl leading-tight sm:text-4xl">Airport-style journey guidance, built for South African rail tourism.</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Inspired by passenger-experience patterns from Japan, Norway, Switzerland, Germany and France, plus
            airport systems such as Schiphol and Heathrow. We adapt the useful parts — journey awareness, contextual
            guidance, digital collecting and location-triggered information — around South African places, culture
            and domestic tourism.
          </p>
        </div>
        <div className="mt-6 grid gap-px overflow-hidden rounded-sm bg-border md:grid-cols-3">
          {[
            ['MOVE', 'Know where you are', 'Journey progress, next station, ETA-style guidance and optional GPS route matching.'],
            ['DISCOVER', 'Know what is around you', 'WindowCast alerts reveal landscapes, heritage and stories at the moment they matter.'],
            ['EXPERIENCE', 'Turn arrival into tourism', 'Station Mode connects rail stops to attractions, local stories, stamps, quizzes and future partner links.'],
          ].map(([step, title, body]) => (
            <article key={step} className="bg-card p-5">
              <p className="font-mono text-[11px] text-primary">{step}</p>
              <h3 className="mt-2 text-2xl leading-none">{title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Real route scenes */}
      <section className="mx-auto max-w-6xl px-5 pb-12">
        <p className="mono-label text-dust">Real places on the route</p>
        <h2 className="mt-2 max-w-2xl text-3xl leading-tight sm:text-4xl">
          A more grounded visual feel for the journey
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BIOMES.map((b) => (
            <figure key={b.title} className="overflow-hidden rounded-sm border border-border bg-card">
              <img
                src={b.img}
                alt={b.alt}
                loading="lazy"
                width={1024}
                height={768}
                className="h-44 w-full object-cover"
              />
              <figcaption className="p-4">
                <p className="font-mono text-[11px] text-dust">{b.km}</p>
                <h3 className="mt-1 text-xl leading-none">{b.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{b.body}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>


      {/* Your journey */}
      <section className="mx-auto max-w-6xl px-5 pb-10">
        <div className="rounded-sm border border-border bg-card p-5">
          <p className="mono-label text-dust">
            {user ? `Kicking off, ${profile?.display_name ?? "traveller"}` : "Your journey"}
          </p>
          {user ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <Progress label="Stamps collected" value={stamps} total={STOPS.length} to="/passport" />
              <Progress label="Quiz points" value={points} total={MAX_POINTS} to="/quiz" />
              <Progress label="Saved trips" value={trips} total={Math.max(trips, 3)} to="/plan" />
            </div>
          ) : (
            <p className="mt-3 max-w-lg text-sm text-muted-foreground">
              Sign in to collect station stamps, save trip plans, score {MAX_POINTS} quiz points across{" "}
              {QUESTIONS.length} questions and post your own station stories.{" "}
              <Link to="/auth" className="text-primary underline-offset-4 hover:underline">
                Create a free passport →
              </Link>
            </p>
          )}
        </div>
      </section>

      {/* Cards */}
      <section className="mx-auto grid max-w-6xl gap-4 px-5 pb-12 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="group rounded-sm border border-border bg-card p-5 transition-colors hover:border-primary"
          >
            <span className="font-mono text-[11px] text-dust">{c.kicker}</span>
            <h2 className="mt-2 text-2xl leading-none group-hover:text-primary">{c.title}</h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{c.body}</p>
          </Link>
        ))}
      </section>

      {/* Threads + leaderboard */}
      <section className="mx-auto grid max-w-6xl gap-4 px-5 pb-16 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-sm border border-border bg-card p-5">
          <p className="mono-label text-dust">Storylines along the track</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {THREADS.map((th) => (
              <span
                key={th.id}
                className="rounded-full border px-3 py-1 text-[11px]"
                style={{ borderColor: th.color, color: th.color }}
              >
                {th.label}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Every stop is tagged with the threads it belongs to, so you can travel the line by the story you care
            about — the diamond rush, the fight for water, the older names beneath the map, or the conflicts the rails
            carried.
          </p>
        </div>

        <div className="rounded-sm border border-border bg-card p-5">
          <p className="mono-label text-dust">Leaderboard</p>
          {board.length === 0 ? (
            <p className="mt-3 text-xs text-muted-foreground">No scores yet — be the first down the line.</p>
          ) : (
            <ol className="mt-3 space-y-1.5 font-mono text-xs">
              {board.map((row, i) => (
                <li key={`${row.name}-${i}`} className="flex justify-between">
                  <span className="text-muted-foreground">
                    {i + 1}. {row.name}
                  </span>
                  <span className="text-sand">{row.points}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      <footer className="border-t border-border px-5 py-8 text-center font-mono text-[11px] text-dust">
        Karoo & Coast ·{" "}
        <Link to="/about" className="text-primary underline-offset-4 hover:underline">
          how it was built
        </Link>{" "}
        · built for the Geekulcha Train Tourism Hackathon
      </footer>
    </div>
  );
}

function Progress({
  label,
  value,
  total,
  to,
}: {
  label: string;
  value: number;
  total: number;
  to: "/passport" | "/quiz" | "/plan";
}) {
  const pct = total ? Math.min(100, Math.round((value / total) * 100)) : 0;
  return (
    <Link to={to} className="block rounded-sm border border-border p-4 hover:border-primary">
      <p className="font-mono text-[11px] text-dust">{label}</p>
      <p className="mt-1 text-3xl text-sand">
        {value}
        <span className="text-base text-dust"> / {total}</span>
      </p>
      <div className="mt-3 h-1 w-full rounded-full bg-muted">
        <div className="h-1 rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
    </Link>
  );
}
