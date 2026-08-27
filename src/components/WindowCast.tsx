import type { Stop } from "@/data/stops";
import type { WindowCast as WindowCastData } from "@/data/experience";
import { minutesAtKm } from "@/lib/journey";

const SIDE: Record<WindowCastData["side"], string> = {
  left: "LOOK LEFT",
  right: "LOOK RIGHT",
  both: "LOOK OUTSIDE",
  sky: "LOOK UP",
};

export default function WindowCast({
  km,
  cast,
  stop,
  onOpen,
}: {
  km: number;
  cast: WindowCastData;
  stop: Stop;
  onOpen: () => void;
}) {
  const distance = Math.max(0, stop.km - km);
  const mins = Math.max(0, Math.round(minutesAtKm(stop.km) - minutesAtKm(km)));
  const here = distance <= 3;

  return (
    <aside className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-sm border border-primary/60 bg-card/95 backdrop-blur-md" aria-live="polite">
      <div className="ndebele-strip w-full" />
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="mono-label text-primary">WindowCast™</p>
          <span className="font-mono text-[10px] text-dust">{here ? "NOW" : `${Math.ceil(distance)} km · ~${mins} min`}</span>
        </div>
        <div className="mt-2 flex gap-3">
          <span className="text-2xl" aria-hidden="true">{cast.icon}</span>
          <div className="min-w-0">
            <p className="font-mono text-[11px] text-sand">{SIDE[cast.side]}</p>
            <h3 className="mt-1 text-xl leading-tight">{cast.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{cast.prompt}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpen}
          className="mt-3 rounded-sm bg-primary px-3 py-1.5 text-[11px] font-medium text-primary-foreground hover:opacity-90"
        >
          {here ? "Open this story" : `${cast.action} →`}
        </button>
      </div>
    </aside>
  );
}
