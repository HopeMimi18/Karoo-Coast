import { THREADS, type Stop } from "@/data/stops";
import { t, type Lang } from "@/lib/i18n";
import { clockAtKm, dayAtKm, fmtKm } from "@/lib/journey";

function leadFor(stop: Stop, lang: Lang) {
  if (lang === "af" && stop.lead_af) return stop.lead_af;
  if (lang === "xh" && stop.lead_xh) return stop.lead_xh;
  return stop.lead;
}

export default function StoryPanel({
  stop,
  lang,
  speaking,
  onSpeak,
}: {
  stop: Stop;
  lang: Lang;
  speaking: boolean;
  onSpeak: () => void;
}) {
  const localised = leadFor(stop, lang);
  return (
    <article key={stop.id} className="drift-in space-y-5">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="mono-label text-primary">
            {stop.kind === "stop" ? `${t(lang, "leg")} ${stop.leg}` : t(lang, "passing")}
          </span>
          <span className="h-px flex-1 bg-border" />
          <span className="font-mono text-[11px] text-muted-foreground">
            {fmtKm(stop.km)} · {clockAtKm(stop.km)}
            <span className="text-dust"> d{dayAtKm(stop.km)}</span>
          </span>
        </div>

        <h2 className="text-3xl leading-[1.1] text-foreground sm:text-4xl">{stop.name}</h2>

        {stop.native && (
          <p className="text-sm">
            <span className="mono-label mr-2 text-dust">{t(lang, "namedBefore")}</span>
            <span className="font-display text-lg text-sand">{stop.native}</span>
            {stop.nativeMeaning && (
              <span className="block text-xs text-muted-foreground">{stop.nativeMeaning}</span>
            )}
          </p>
        )}

        <p className="font-display text-xl leading-snug text-primary">{localised}</p>
        {lang !== "en" && localised !== stop.lead && (
          <p className="text-xs italic text-muted-foreground">{stop.lead}</p>
        )}
      </header>

      {stop.facts.length > 0 && (
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-sm bg-border sm:grid-cols-4">
          {stop.facts.map(([v, k]) => (
            <div key={k} className="bg-card px-3 py-2.5">
              <dt className="font-mono text-base text-sand">{v}</dt>
              <dd className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{k}</dd>
            </div>
          ))}
        </dl>
      )}

      <p className="text-[15px] leading-relaxed text-foreground/85">{stop.body}</p>

      {stop.scene && (
        <p className="border-l-2 border-primary/60 pl-3 text-sm italic text-sand/90">
          <span className="mono-label mr-2 not-italic text-dust">{t(lang, "window")}</span>
          {stop.scene}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {stop.threads.map((id) => {
          const th = THREADS.find((x) => x.id === id)!;
          return (
            <span
              key={id}
              className="rounded-full border px-2.5 py-1 text-[11px]"
              style={{ borderColor: th.color, color: th.color }}
            >
              {th.label}
            </span>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 hairline pt-4">
        <button
          onClick={onSpeak}
          className="inline-flex items-center gap-2 rounded-sm border border-primary/50 px-3 py-1.5 text-xs text-primary transition-colors hover:bg-primary/10"
        >
          <span className={speaking ? "animate-pulse" : ""}>◉</span>
          {speaking ? t(lang, "stopListening") : t(lang, "listen")}
        </button>
        {stop.source?.url && (
          <a
            href={stop.source.url}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-muted-foreground underline decoration-dotted underline-offset-4 hover:text-foreground"
          >
            {t(lang, "source")}: {stop.source.label}
          </a>
        )}
      </div>
    </article>
  );
}
