import { useMemo, useState } from "react";
import type { StationIntelligence } from "@/data/experience";
import { localDiscovery, mapsSearchUrl, remoteStopNote, type LocalPlaceKind } from "@/data/localPlaces";

type LocalTab = "all" | LocalPlaceKind;

export default function StationMode({ station }: { station: StationIntelligence }) {
  const [tab, setTab] = useState<LocalTab>("all");
  const local = localDiscovery(station.stopId);
  const remoteNote = remoteStopNote(station.stopId);

  const places = useMemo(() => {
    if (!local) return [];
    return tab === "all" ? local.places : local.places.filter((place) => place.kind === tab);
  }, [local, tab]);

  const eatCount = local?.places.filter((place) => place.kind === "eat").length ?? 0;
  const stayCount = local?.places.filter((place) => place.kind === "stay").length ?? 0;

  return (
    <section className="mt-6 hairline pt-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="mono-label text-dust">Station mode</p>
          <h3 className="mt-1 text-xl">Turn arrival into discovery</h3>
        </div>
        <span className="rounded-full border border-thread-water px-2 py-1 font-mono text-[10px] text-thread-water">
          RAIL → TOURISM
        </span>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{station.stationNote}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {station.services.map((service) => (
          <span key={service} className="rounded-full border border-border px-2 py-1 text-[10px] text-muted-foreground">
            {service}
          </span>
        ))}
      </div>

      {station.nearby.length > 0 && (
        <div className="mt-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-dust">Discover nearby</p>
          <div className="mt-2 space-y-2">
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
        </div>
      )}

      <div className="mt-5 rounded-sm border border-border bg-background/35 p-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Eat & stay nearby</p>
            <h4 className="mt-1 text-base text-foreground">Local stops worth extending the journey for</h4>
            {local && <p className="mt-1 text-[10px] text-dust">{local.areaLabel}</p>}
          </div>
          {local && (
            <div className="flex gap-1 font-mono text-[9px] text-dust">
              <span className="rounded-full border border-border px-2 py-1">🍽 {eatCount}</span>
              <span className="rounded-full border border-border px-2 py-1">🛏 {stayCount}</span>
            </div>
          )}
        </div>

        {local ? (
          <>
            <div className="mt-3 flex flex-wrap gap-1.5" role="tablist" aria-label="Filter nearby places">
              {([
                ["all", "All"],
                ["eat", "🍽 Eat"],
                ["stay", "🛏 Stay"],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTab(value)}
                  aria-pressed={tab === value}
                  className={`rounded-full border px-2.5 py-1 text-[10px] transition-colors ${
                    tab === value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {local.accessNote && (
              <p className="mt-3 rounded-sm border border-border bg-card/60 px-3 py-2 text-[10px] leading-relaxed text-muted-foreground">
                {local.accessNote}
              </p>
            )}

            <div className="mt-3 space-y-2">
              {places.map((place) => (
                <article key={`${place.kind}-${place.name}`} className="rounded-sm border border-border bg-card/70 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm" aria-hidden="true">{place.kind === "eat" ? "🍽" : "🛏"}</span>
                        <p className="text-sm text-sand">{place.name}</p>
                      </div>
                      <p className="mt-1 font-mono text-[9px] uppercase tracking-wide text-dust">{place.subtype}</p>
                    </div>
                    <a
                      href={mapsSearchUrl(place)}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 rounded-sm border border-border px-2 py-1 font-mono text-[9px] text-muted-foreground hover:border-primary hover:text-primary"
                    >
                      Maps ↗
                    </a>
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{place.note}</p>
                  <p className="mt-2 text-[9px] leading-relaxed text-dust">{place.location}</p>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="mt-3 rounded-sm border border-dashed border-border p-3">
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              {remoteNote ?? "Verified food and accommodation listings for this stop are still being added."}
            </p>
          </div>
        )}
      </div>

      <p className="mt-3 font-mono text-[9px] leading-relaxed text-dust">
        Curated prototype listings researched in Aug 2026. Opening hours, availability and transport access can change — use Maps or the venue directly before travelling. Future production data should come from verified tourism and operator feeds.
      </p>
    </section>
  );
}
