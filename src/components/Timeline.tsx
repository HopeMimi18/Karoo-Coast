import { STOPS } from "@/data/stops";
import { TOTAL_KM, clockAtKm, daylightAtKm } from "@/lib/journey";
import { t, type Lang } from "@/lib/i18n";

/** Horizontal scrubber: the whole 1 546 km with every moment marked. */
export default function Timeline({
  km,
  onScrub,
  activeId,
  lang,
}: {
  km: number;
  onScrub: (km: number) => void;
  activeId: string;
  lang: Lang;
}) {
  const pct = (km / TOTAL_KM) * 100;

  // Day/night bands across the run.
  const bands = Array.from({ length: 60 }, (_, i) => {
    const k = (i / 59) * TOTAL_KM;
    return daylightAtKm(k);
  });

  return (
    <div className="space-y-2">
      <div className="flex h-2 w-full overflow-hidden rounded-full">
        {bands.map((d, i) => (
          <div
            key={i}
            className="flex-1"
            style={{ background: `color-mix(in oklab, var(--sand) ${Math.round(d * 62 + 8)}%, oklch(0.16 0.03 265))` }}
          />
        ))}
      </div>

      <div className="relative h-12 select-none">
        <div className="absolute inset-x-0 top-5 h-px bg-border" />
        <div
          className="absolute top-5 left-0 h-px bg-primary"
          style={{ width: `${pct}%` }}
        />
        {STOPS.map((s) => {
          const left = (s.km / TOTAL_KM) * 100;
          const active = s.id === activeId;
          return (
            <button
              key={s.id}
              onClick={() => onScrub(s.km)}
              title={`${s.name} — ${clockAtKm(s.km)}`}
              aria-label={s.name}
              className="group absolute -translate-x-1/2"
              style={{ left: `${left}%`, top: s.kind === "stop" ? "12px" : "16px" }}
            >
              <span
                className={[
                  "block rounded-full transition-all",
                  s.kind === "stop" ? "h-2.5 w-2.5" : "h-1.5 w-1.5",
                  active
                    ? "bg-primary ring-4 ring-primary/25"
                    : s.km <= km
                      ? "bg-sand"
                      : "bg-dust group-hover:bg-sand",
                ].join(" ")}
              />
              <span className="pointer-events-none absolute left-1/2 top-5 hidden -translate-x-1/2 whitespace-nowrap rounded-sm bg-popover px-2 py-1 text-[10px] text-popover-foreground shadow-lg group-hover:block">
                {s.name}
              </span>
            </button>
          );
        })}
        <input
          type="range"
          min={0}
          max={TOTAL_KM}
          step={1}
          value={km}
          onChange={(e) => onScrub(Number(e.target.value))}
          aria-label={t(lang, "distance")}
          className="absolute inset-x-0 top-2 h-8 w-full cursor-pointer opacity-0"
        />
      </div>
    </div>
  );
}
