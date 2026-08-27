import type { Stop } from "@/data/stops";
import { TOTAL_KM, clockAtKm, fmtKm, minutesAtKm } from "@/lib/journey";

type Props = {
  km: number;
  active: Stop;
  nextStation?: Stop | undefined;
  mode: "demo" | "gps";
  gpsStatus?: string | null;
  onDemo: () => void;
  onGps: () => void;
};

function timeUntil(fromKm: number, toKm: number): string {
  const mins = Math.max(0, Math.round(minutesAtKm(toKm) - minutesAtKm(fromKm)));
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

export default function JourneyStatus({ km, active, nextStation, mode, gpsStatus, onDemo, onGps }: Props) {
  const pct = Math.min(100, Math.max(0, (km / TOTAL_KM) * 100));

  return (
    <section className="rounded-sm border border-border bg-background/60 p-4" aria-label="Journey status">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="mono-label text-dust">Journey intelligence</p>
          <p className="mt-1 text-lg leading-none">Pretoria <span className="text-dust">→</span> Cape Town</p>
        </div>
        <span className={`rounded-full border px-2 py-1 font-mono text-[10px] ${mode === "gps" ? "border-thread-name text-thread-name" : "border-primary text-primary"}`}>
          {mode === "gps" ? "GPS MODE" : "DEMO MODE"}
        </span>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1 flex justify-between font-mono text-[10px] text-dust">
        <span>{Math.round(pct)}%</span>
        <span>{fmtKm(Math.max(0, TOTAL_KM - km))} remaining</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-sm bg-border">
        <div className="bg-card p-3">
          <p className="mono-label text-dust">Now</p>
          <p className="mt-1 text-sm text-sand">{active.name}</p>
          <p className="mt-1 font-mono text-[10px] text-muted-foreground">{fmtKm(km)}</p>
        </div>
        <div className="bg-card p-3">
          <p className="mono-label text-dust">Next station</p>
          {nextStation ? (
            <>
              <p className="mt-1 text-sm text-sand">{nextStation.name}</p>
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                {clockAtKm(nextStation.km)} · {timeUntil(km, nextStation.km)}
              </p>
            </>
          ) : (
            <p className="mt-1 text-sm text-sand">Journey complete</p>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onDemo}
          className={`rounded-sm border px-3 py-1.5 text-[11px] ${mode === "demo" ? "border-primary text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
        >
          Explore demo
        </button>
        <button
          type="button"
          onClick={onGps}
          className={`rounded-sm border px-3 py-1.5 text-[11px] ${mode === "gps" ? "border-thread-name text-thread-name" : "border-border text-muted-foreground hover:text-foreground"}`}
        >
          I'm on the train · use GPS
        </button>
      </div>
      {gpsStatus && <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{gpsStatus}</p>}
    </section>
  );
}
