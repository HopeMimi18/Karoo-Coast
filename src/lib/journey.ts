import { ROUTE, ROUTE_KM, TOTAL_KM } from "@/data/route";
import { STOPS, type Stop } from "@/data/stops";

export type LatLon = [number, number];

/** Interpolated position along the rail line at a given kilometre mark. */
export function positionAtKm(km: number): LatLon {
  const target = Math.max(0, Math.min(TOTAL_KM, km));
  let lo = 0;
  let hi = ROUTE_KM.length - 1;
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1;
    if (ROUTE_KM[mid] <= target) lo = mid;
    else hi = mid;
  }
  const a = ROUTE[lo];
  const b = ROUTE[hi];
  const span = ROUTE_KM[hi] - ROUTE_KM[lo] || 1;
  const t = (target - ROUTE_KM[lo]) / span;
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

/** Compass bearing of travel at a kilometre mark, in degrees. */
export function bearingAtKm(km: number): number {
  const a = positionAtKm(Math.max(0, km - 4));
  const b = positionAtKm(Math.min(TOTAL_KM, km + 4));
  const y = Math.sin(((b[1] - a[1]) * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180);
  const x =
    Math.cos((a[0] * Math.PI) / 180) * Math.sin((b[0] * Math.PI) / 180) -
    Math.sin((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * Math.cos(((b[1] - a[1]) * Math.PI) / 180);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/** The moment the passenger is currently at or has just passed. */
export function currentStop(km: number): Stop {
  let found = STOPS[0];
  for (const s of STOPS) if (s.km <= km + 6) found = s;
  return found;
}

export function nextStop(km: number): Stop | undefined {
  return STOPS.find((s) => s.km > km + 6);
}

/** Everything already seen, newest first. */
export function passed(km: number): Stop[] {
  return STOPS.filter((s) => s.km <= km + 6).reverse();
}

export const DEPART_MINUTES = 12 * 60 + 30; // 12:30 out of Park Station
export const JOURNEY_MINUTES = 26 * 60;

/** Elapsed journey minutes at a kilometre mark (linear approximation). */
export function minutesAtKm(km: number): number {
  return (km / TOTAL_KM) * JOURNEY_MINUTES;
}

export function clockAtKm(km: number): string {
  const total = DEPART_MINUTES + minutesAtKm(km);
  const h = Math.floor(total / 60) % 24;
  const m = Math.floor(total % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function dayAtKm(km: number): 1 | 2 {
  return DEPART_MINUTES + minutesAtKm(km) >= 24 * 60 ? 2 : 1;
}

/** 0 = deep night, 1 = full daylight. Drives the whole interface. */
export function daylightAtKm(km: number): number {
  const mins = (DEPART_MINUTES + minutesAtKm(km)) % (24 * 60);
  const h = mins / 60;
  if (h >= 8 && h <= 17) return 1;
  if (h >= 20 || h <= 4.5) return 0;
  if (h > 17 && h < 20) return 1 - (h - 17) / 3; // dusk
  return (h - 4.5) / 3.5; // dawn
}

export function elapsedLabel(km: number): string {
  const m = minutesAtKm(km);
  const h = Math.floor(m / 60);
  const mm = Math.floor(m % 60);
  return `${h}h ${String(mm).padStart(2, "0")}m`;
}

export function fmtKm(km: number): string {
  return `${Math.round(km).toLocaleString("en-ZA")} km`;
}

export { TOTAL_KM };
