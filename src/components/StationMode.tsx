import type { StationIntelligence } from "@/data/experience";

export default function StationMode({ station }: { station: StationIntelligence }) {
  return (
    <section className="mt-6 hairline pt-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="mono-label text-dust">Station mode</p>
          <h3 className="mt-1 text-xl">Turn arrival into discovery</h3>
        </div>
        <span className="rounded-full border border-thread-water px-2 py-1 font-mono text-[10px] text-thread-water">RAIL → TOURISM</span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{station.stationNote}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {station.services.map((service) => (
          <span key={service} className="rounded-full border border-border px-2 py-1 text-[10px] text-muted-foreground">
            {service}
          </span>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {station.nearby.map((place) => (
          <div key={place.name} className="rounded-sm border border-border bg-background/45 p-3">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm text-sand">{place.name}</p>
              <span className="font-mono text-[9px] uppercase tracking-wide text-dust">{place.type}</span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{place.note}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 font-mono text-[9px] leading-relaxed text-dust">
        Prototype tourism layer. Live facilities, opening hours and booking links should come from verified operator and tourism-partner feeds.
      </p>
    </section>
  );
}
