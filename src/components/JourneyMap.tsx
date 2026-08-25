import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker, Polyline, CircleMarker } from "leaflet";
import { ROUTE, ROUTE_KM } from "@/data/route";
import { STOPS, type Stop } from "@/data/stops";
import { positionAtKm } from "@/lib/journey";

type Props = {
  km: number;
  follow: boolean;
  night: boolean;
  activeId: string;
  onSelect: (stop: Stop) => void;
};

export default function JourneyMap({ km, follow, night, activeId, onSelect }: Props) {
  const holder = useRef<HTMLDivElement | null>(null);
  const map = useRef<LeafletMap | null>(null);
  const train = useRef<Marker | null>(null);
  const travelled = useRef<Polyline | null>(null);
  const dots = useRef<Record<string, CircleMarker>>({});
  const selectRef = useRef(onSelect);
  selectRef.current = onSelect;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !holder.current || map.current) return;

      const m = L.map(holder.current, {
        zoomControl: true,
        attributionControl: true,
        preferCanvas: true,
      }).setView([-30.2, 23.6], 6);
      map.current = m;

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a> &middot; rail geometry: OSM relation 950176',
        maxZoom: 16,
      }).addTo(m);

      L.polyline(ROUTE, { color: "#8a8078", weight: 2.5, opacity: 0.55 }).addTo(m);
      travelled.current = L.polyline([ROUTE[0]!], {
        color: "#e0813f",
        weight: 4,
        opacity: 0.95,
      }).addTo(m);

      for (const s of STOPS) {
        const dot = L.circleMarker([s.lat, s.lon], {
          radius: s.kind === "stop" ? 4.5 + s.weight : 3.5,
          weight: 1.5,
          color: "#e6d9c6",
          fillColor: s.kind === "stop" ? "#2a2018" : "#8a8078",
          fillOpacity: 1,
        })
          .addTo(m)
          .bindTooltip(`${s.name} · ${Math.round(s.km)} km`, { direction: "top", opacity: 0.9 });
        dot.on("click", () => selectRef.current(s));
        dots.current[s.id] = dot;
      }

      const icon = L.divIcon({
        className: "",
        html: `<div class="relative h-4 w-4 train-pulse"><div class="absolute inset-0 rounded-full bg-[#e0813f] ring-2 ring-[#fff3e2]"></div></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
      train.current = L.marker(positionAtKm(km), { icon, zIndexOffset: 1000 }).addTo(m);
      setTimeout(() => m.invalidateSize(), 200);
    })();

    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Move the train and grow the travelled line.
  useEffect(() => {
    const pos = positionAtKm(km);
    train.current?.setLatLng(pos);
    if (travelled.current) {
      const done: [number, number][] = [];
      for (let i = 0; i < ROUTE.length; i++) {
        if (ROUTE_KM[i]! <= km) done.push(ROUTE[i]!);
        else break;
      }
      travelled.current.setLatLngs([...done, pos]);
    }
    if (follow && map.current) {
      map.current.panTo(pos, { animate: true, duration: 0.9, easeLinearity: 0.4 });
    }
  }, [km, follow]);

  // Highlight the active moment.
  useEffect(() => {
    for (const [id, dot] of Object.entries(dots.current)) {
      const on = id === activeId;
      dot.setStyle({
        fillColor: on ? "#e0813f" : STOPS.find((s) => s.id === id)?.kind === "stop" ? "#2a2018" : "#8a8078",
        color: on ? "#fff3e2" : "#e6d9c6",
        weight: on ? 3 : 1.5,
      });
      if (on) dot.bringToFront();
    }
  }, [activeId]);

  useEffect(() => {
    holder.current?.classList.toggle("night", night);
  }, [night]);

  return <div ref={holder} className="h-full w-full" aria-label="Map of the Cape main line" />;
}
