import { STOPS, type Stop } from "@/data/stops";

export type WindowSide = "left" | "right" | "both" | "sky";

export type WindowCast = {
  stopId: string;
  icon: string;
  side: WindowSide;
  advanceKm: number;
  title: string;
  prompt: string;
  action: string;
};

export type StationIntelligence = {
  stopId: string;
  stationNote: string;
  services: string[];
  nearby: { name: string; type: string; note: string }[];
};

/**
 * Route-aware moments deliberately selected for what a passenger can experience
 * from the moving train. Window side is only stated where the researched story
 * already supports it; otherwise the UI says both sides / look up.
 */
export const WINDOWCASTS: WindowCast[] = [
  {
    stopId: "witwatersrand",
    icon: "⛏️",
    side: "right",
    advanceKm: 28,
    title: "Gold country is coming into view",
    prompt: "Mine dumps and headgear begin to tell the story of the reef that financed the railway.",
    action: "Look right",
  },
  {
    stopId: "vaal",
    icon: "💧",
    side: "both",
    advanceKm: 24,
    title: "Vaal River crossing ahead",
    prompt: "Watch the landscape change as the train reaches one of the great water boundaries of the interior.",
    action: "Watch the crossing",
  },
  {
    stopId: "orange-river",
    icon: "🌊",
    side: "both",
    advanceKm: 30,
    title: "Approaching !Gariep",
    prompt: "The Orange River story links water, settlement and the diamond route through the Northern Cape.",
    action: "Look outside",
  },
  {
    stopId: "karoo-night",
    icon: "🌌",
    side: "sky",
    advanceKm: 35,
    title: "Karoo dark-sky moment",
    prompt: "Turn down the cabin light and give your eyes time to adjust. The journey becomes the attraction.",
    action: "Look up",
  },
  {
    stopId: "three-sisters",
    icon: "🪨",
    side: "both",
    advanceKm: 28,
    title: "Three Sisters approaching",
    prompt: "Three dolerite-capped koppies make deep geological time visible from the window.",
    action: "Find the three peaks",
  },
  {
    stopId: "hex-river-tunnels",
    icon: "🚇",
    side: "both",
    advanceKm: 22,
    title: "Hex River tunnels ahead",
    prompt: "The route is about to disappear into the mountain system that shaped Cape-gauge railway engineering.",
    action: "Watch for the tunnel",
  },
  {
    stopId: "hex-valley",
    icon: "🍇",
    side: "both",
    advanceKm: 18,
    title: "The valley opens below",
    prompt: "Vineyards and mountain walls replace the Karoo as the train descends toward the Winelands.",
    action: "Look outside",
  },
  {
    stopId: "table-mountain",
    icon: "⛰️",
    side: "right",
    advanceKm: 24,
    title: "Table Mountain reveal",
    prompt: "After crossing the country, Devil's Peak and the flat-topped mountain appear over the Cape Flats.",
    action: "Look right",
  },
];

export const STATION_INTELLIGENCE: StationIntelligence[] = [
  {
    stopId: "pretoria",
    stationNote: "Capital-city gateway. Use this stop to introduce the journey, heritage and the transition into the national rail story.",
    services: ["Journey orientation", "Accessibility info", "Local transport", "Tourism links"],
    nearby: [
      { name: "Pretoria Station heritage", type: "Heritage", note: "Herbert Baker-designed station building and railway precinct." },
      { name: "Freedom Park / Salvokop", type: "Culture", note: "A major heritage landscape overlooking the station precinct." },
      { name: "Tshwane city story", type: "Local story", note: "Capital-city history, names and communities before departure." },
    ],
  },
  {
    stopId: "johannesburg",
    stationNote: "Major rail interchange and the handover point from the Pretoria gateway into the detailed Cape main-line journey.",
    services: ["Interchange", "Local transport", "Food nearby", "Safety guidance"],
    nearby: [
      { name: "Braamfontein", type: "Urban culture", note: "Creative, student and city-life precinct beside Park Station." },
      { name: "Constitution Hill", type: "Heritage", note: "A major Johannesburg history and human-rights site." },
      { name: "eGoli story", type: "Local story", note: "Follow the gold-and-migration thread as the train leaves the city." },
    ],
  },
  {
    stopId: "kimberley",
    stationNote: "A major tourism anchor where the railway, diamond economy and city history intersect.",
    services: ["Tourism gateway", "Local transport", "Food nearby", "Heritage links"],
    nearby: [
      { name: "The Big Hole", type: "Attraction", note: "Kimberley's best-known diamond-mining landmark." },
      { name: "Kimberley Mine Museum", type: "Museum", note: "Explore the city's diamond-rush and mining history." },
      { name: "Diamond story trail", type: "Karoo & Coast", note: "Continue the diamond thread through the station story and quiz." },
    ],
  },
  {
    stopId: "beaufort-west",
    stationNote: "The natural pause point for the Great Karoo: geology, conservation, railway heritage and local history.",
    services: ["Karoo orientation", "Local transport", "Food nearby", "Nature links"],
    nearby: [
      { name: "Karoo National Park", type: "Nature", note: "Mountain, fossil and wildlife landscape on the edge of town." },
      { name: "Chris Barnard story", type: "Heritage", note: "Local history connected to the pioneering heart surgeon born here." },
      { name: "Railway blockhouse", type: "Rail heritage", note: "A visible conflict-era railway structure on the southern approach." },
    ],
  },
  {
    stopId: "matjiesfontein",
    stationNote: "A compact heritage stop where railway history is already part of the destination experience.",
    services: ["Heritage village", "Food nearby", "Walking exploration", "Story trail"],
    nearby: [
      { name: "Matjiesfontein village", type: "Heritage", note: "Victorian railway architecture and preserved streetscape." },
      { name: "Transport collection", type: "Rail heritage", note: "A natural extension of the railway-focused journey story." },
      { name: "Local name story", type: "Language", note: "Explore how the place name connects landscape, language and memory." },
    ],
  },
  {
    stopId: "worcester",
    stationNote: "Transition from mountain engineering into the Breede River Valley and Cape agricultural landscape.",
    services: ["Local transport", "Food nearby", "Winelands links", "Accessibility info"],
    nearby: [
      { name: "Breede Valley", type: "Landscape", note: "Agriculture, mountains and water shape the region around the line." },
      { name: "Local heritage experiences", type: "Culture", note: "Surface museums, markets and community stories through partner data." },
      { name: "Winelands route", type: "Tourism", note: "Continue south into vineyard country toward Paarl and Cape Town." },
    ],
  },
  {
    stopId: "huguenot",
    stationNote: "Paarl/Huguenot is a strong point for language, landscape and Winelands tourism discovery.",
    services: ["Winelands links", "Local transport", "Food nearby", "Culture links"],
    nearby: [
      { name: "Paarl Mountain", type: "Nature", note: "Granite landscape overlooking the town and valley." },
      { name: "Afrikaans Language Monument", type: "Culture", note: "A major language-and-identity landmark in Paarl." },
      { name: "Winelands experiences", type: "Tourism", note: "Partner listings can connect the rail journey to local farms and experiences." },
    ],
  },
  {
    stopId: "cape-town",
    stationNote: "Journey completion becomes a launch point into the city rather than the end of the experience.",
    services: ["Journey completion", "Local transport", "City tourism", "Accessibility info"],
    nearby: [
      { name: "District Six Museum", type: "Heritage", note: "A powerful city story close to the central rail precinct." },
      { name: "Castle of Good Hope", type: "Heritage", note: "Historic landmark within the central-city tourism area." },
      { name: "Cape Town discovery", type: "Tourism", note: "Continue into neighbourhood, food, nature and cultural experiences." },
    ],
  },
];

export function stopById(id: string): Stop | undefined {
  return STOPS.find((stop) => stop.id === id);
}

export function nextWindowCast(km: number): { cast: WindowCast; stop: Stop; distanceKm: number } | undefined {
  const candidates = WINDOWCASTS.map((cast) => {
    const stop = stopById(cast.stopId);
    return stop ? { cast, stop, distanceKm: stop.km - km } : undefined;
  })
    .filter((x): x is { cast: WindowCast; stop: Stop; distanceKm: number } => Boolean(x))
    .filter((x) => x.distanceKm >= -3 && x.distanceKm <= x.cast.advanceKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);
  return candidates[0];
}

export function stationIntelligence(stopId: string): StationIntelligence | undefined {
  return STATION_INTELLIGENCE.find((station) => station.stopId === stopId);
}
