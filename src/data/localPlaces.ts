export type LocalPlaceKind = "eat" | "stay";

export type LocalPlace = {
  name: string;
  kind: LocalPlaceKind;
  subtype: string;
  note: string;
  location: string;
};

export type LocalDiscovery = {
  areaLabel: string;
  accessNote?: string;
  places: LocalPlace[];
};

/**
 * Curated tourism-business examples researched for the hackathon prototype.
 * Listings were checked against public business/tourism sources in August 2026.
 * Hours, availability and operating status can change; the UI deliberately sends
 * travellers to Maps for current details instead of presenting stale live data.
 */
export const LOCAL_DISCOVERY: Record<string, LocalDiscovery> = {
  pretoria: {
    areaLabel: "Pretoria Central / Salvokop",
    places: [
      {
        name: "Rockefeller Restaurant by Manhattan Hotel",
        kind: "eat",
        subtype: "Restaurant",
        note: "Central-city dining option close to the Pretoria rail precinct.",
        location: "247 Scheiding Street, Pretoria Central, Pretoria",
      },
      {
        name: "StayEasy Pretoria",
        kind: "stay",
        subtype: "Hotel",
        note: "Central Pretoria hotel option for travellers starting or ending a rail journey in the capital.",
        location: "632 Lilian Ngoyi Street, Pretoria Central, Pretoria",
      },
    ],
  },
  johannesburg: {
    areaLabel: "Park Station / Braamfontein",
    places: [
      {
        name: "Fishaways Park Station",
        kind: "eat",
        subtype: "Restaurant",
        note: "Food option inside the Park Station complex — useful for a quick meal before departure or during a connection.",
        location: "Johannesburg Park Station, Rissik Street, Braamfontein, Johannesburg",
      },
      {
        name: "The Parktonian All-Suite Hotel",
        kind: "stay",
        subtype: "Hotel",
        note: "Braamfontein accommodation within the wider Park Station city precinct.",
        location: "120 De Korte Street, Braamfontein, Johannesburg",
      },
    ],
  },
  klerksdorp: {
    areaLabel: "Klerksdorp",
    places: [
      {
        name: "Voerkraal Restaurant Klerksdorp",
        kind: "eat",
        subtype: "Steakhouse",
        note: "A well-known local dining option in Klerksdorp for travellers extending their stop into town.",
        location: "47 Buffelsdoorn Road, Wilkoppies, Klerksdorp",
      },
      {
        name: "Protea Hotel Klerksdorp",
        kind: "stay",
        subtype: "Hotel",
        note: "Established hotel accommodation in central Klerksdorp.",
        location: "Margaretha Prinsloo Street, Klerksdorp Central, Klerksdorp",
      },
    ],
  },
  bloemhof: {
    areaLabel: "Bloemhof",
    places: [
      {
        name: "Buffalo Restaurant",
        kind: "eat",
        subtype: "Bar & grill",
        note: "Local dining option on Prince Street in Bloemhof.",
        location: "66 Prince Street, Bloemhof",
      },
      {
        name: "French Linen Guest House",
        kind: "stay",
        subtype: "Guest house",
        note: "Guest-house accommodation in town for an overnight stop around the Vaal/Bloemhof section.",
        location: "53 Evans Street, Bloemhof",
      },
    ],
  },
  christiana: {
    areaLabel: "Christiana",
    places: [
      {
        name: "Vaal de Vue Guest House and Restaurant",
        kind: "eat",
        subtype: "Restaurant",
        note: "Riverside dining in Christiana, linking naturally to the route's Vaal River story.",
        location: "Christiana, North West",
      },
      {
        name: "Wingerd Guest House",
        kind: "stay",
        subtype: "Guest house",
        note: "Local guest-house accommodation in Christiana.",
        location: "65 Pretorius Street, Christiana",
      },
    ],
  },
  warrenton: {
    areaLabel: "Warrenton",
    places: [
      {
        name: "Warrenton Pub and Grill",
        kind: "eat",
        subtype: "Restaurant",
        note: "Local pub-and-grill option in Warrenton town.",
        location: "62 Erasmus Street, Warrenton",
      },
      {
        name: "Immanuel Guest House",
        kind: "stay",
        subtype: "Guest house",
        note: "Guest-house accommodation within Warrenton.",
        location: "4 Merwe Street, Warrenton",
      },
    ],
  },
  kimberley: {
    areaLabel: "Kimberley",
    places: [
      {
        name: "The Hussar Grill Kimberley",
        kind: "eat",
        subtype: "Steakhouse",
        note: "A polished dining option in Kimberley for a longer tourism stop.",
        location: "229 Du Toitspan Road, Belgravia, Kimberley",
      },
      {
        name: "Protea Hotel Kimberley",
        kind: "stay",
        subtype: "Hotel",
        note: "Hotel beside the Big Hole tourism precinct — useful for turning the rail stop into an overnight city experience.",
        location: "The Big Hole, West Circular Road, Kimberley",
      },
    ],
  },
  "orange-river": {
    areaLabel: "Hopetown / Orange River",
    accessNote: "The rail stop sits outside the main Hopetown visitor cluster; allow for local road transfer when planning a stopover.",
    places: [
      {
        name: "Die Stalle Restaurant",
        kind: "eat",
        subtype: "Restaurant",
        note: "A recognised Hopetown dining stop that complements the Orange River and diamond-discovery story.",
        location: "Kerk and Wild Street, Hopetown",
      },
      {
        name: "Hopetown Guesthouse",
        kind: "stay",
        subtype: "Guest house",
        note: "Town accommodation for travellers building an overnight Orange River stopover.",
        location: "5 Steyn Street, Hopetown",
      },
    ],
  },
  "de-aar": {
    areaLabel: "De Aar",
    places: [
      {
        name: "Pringles Pub and Restaurant",
        kind: "eat",
        subtype: "Restaurant",
        note: "Local restaurant on Voortrekker Street in the historic railway town.",
        location: "55 Voortrekker Street, De Aar",
      },
      {
        name: "Karoo Stop Guesthouse",
        kind: "stay",
        subtype: "Guest house",
        note: "Guest-house accommodation in De Aar for a rail-themed overnight stop.",
        location: "70 Vermeulen Street, De Aar",
      },
    ],
  },
  "beaufort-west": {
    areaLabel: "Beaufort West",
    places: [
      {
        name: "4 Sheep Restaurant Deli and Convenience Store",
        kind: "eat",
        subtype: "Restaurant",
        note: "Popular central Beaufort West stop for food during a Karoo journey.",
        location: "3 Donkin Street, Beaufort West",
      },
      {
        name: "Cape Karoo Guesthouse",
        kind: "stay",
        subtype: "Guest house",
        note: "Well-established Beaufort West guest-house option for an overnight Karoo break.",
        location: "23 Stroebel Street, Beaufort West",
      },
    ],
  },
  laingsburg: {
    areaLabel: "Laingsburg",
    places: [
      {
        name: "Tannie Poppie se Roosterkoek",
        kind: "eat",
        subtype: "Restaurant",
        note: "Local Karoo food stop that gives the station experience a distinctly regional flavour.",
        location: "N1, Laingsburg",
      },
      {
        name: "Soutbos Cottages",
        kind: "stay",
        subtype: "Cottages",
        note: "Small-scale accommodation in Laingsburg for travellers exploring the town beyond the station.",
        location: "Voortrekker Street, Laingsburg",
      },
    ],
  },
  matjiesfontein: {
    areaLabel: "Matjiesfontein heritage village",
    accessNote: "Matjiesfontein is unusually compact: the station, hotel, restaurants and heritage village form one walkable visitor experience.",
    places: [
      {
        name: "The Laird's Arms",
        kind: "eat",
        subtype: "Historic pub",
        note: "A heritage pub beside the Lord Milner Hotel, closely tied to Matjiesfontein's railway-era identity.",
        location: "Matjiesfontein, Western Cape",
      },
      {
        name: "Lord Milner Hotel",
        kind: "stay",
        subtype: "Historic hotel",
        note: "The signature heritage stay in Matjiesfontein and one of the strongest rail-tourism stopover experiences on the route.",
        location: "Matjiesfontein, Western Cape",
      },
    ],
  },
  "touws-river": {
    areaLabel: "Touws River",
    places: [
      {
        name: "Patriot Coffee Shop",
        kind: "eat",
        subtype: "Coffee shop",
        note: "Local Touws River tourism listing for coffee and light meals along the N1 corridor.",
        location: "Engen Truck Stop, N1 Highway, Touws River",
      },
      {
        name: "Nuwedam Guest Farm",
        kind: "stay",
        subtype: "Guest farm",
        note: "Karoo-style guest-farm accommodation in the wider Touws River area.",
        location: "N1, Touws River",
      },
    ],
  },
  worcester: {
    areaLabel: "Worcester",
    places: [
      {
        name: "Fowlers Grill",
        kind: "eat",
        subtype: "Restaurant",
        note: "Central Worcester restaurant option as the journey transitions from mountain engineering into the Breede Valley.",
        location: "48 Church Street, Worcester Central, Worcester",
      },
      {
        name: "Uitvlugt Guest House",
        kind: "stay",
        subtype: "Guest house",
        note: "Guest-house option in the Worcester area for travellers extending their Winelands gateway stop.",
        location: "N1, Worcester",
      },
    ],
  },
  wellington: {
    areaLabel: "Wellington",
    places: [
      {
        name: "Cole | The Eatery",
        kind: "eat",
        subtype: "Restaurant",
        note: "Local Wellington eatery in the heart of the Winelands town.",
        location: "16 Addy Road, Wellington",
      },
      {
        name: "La Rochelle Guesthouse",
        kind: "stay",
        subtype: "Guest house",
        note: "Central Wellington guest-house option for a slower Winelands stopover.",
        location: "13 Jan Van Riebeeck Street, Wellington",
      },
    ],
  },
  huguenot: {
    areaLabel: "Paarl / Huguenot",
    places: [
      {
        name: "Noop",
        kind: "eat",
        subtype: "Restaurant",
        note: "Established Paarl restaurant on Main Road for travellers exploring the town beyond the station.",
        location: "127 Main Road, Paarl",
      },
      {
        name: "A'Queenslin Guesthouse",
        kind: "stay",
        subtype: "Guest house",
        note: "Guest-house option in Paarl for an overnight Winelands extension.",
        location: "2 Queen Street, Paarl",
      },
    ],
  },
  bellville: {
    areaLabel: "Bellville",
    places: [
      {
        name: "Silver Spur",
        kind: "eat",
        subtype: "Family restaurant",
        note: "Bellville dining option in the broader station-area urban node.",
        location: "Alexandra Street, Bellville, Cape Town",
      },
      {
        name: "Town Lodge Bellville",
        kind: "stay",
        subtype: "Hotel",
        note: "Bellville hotel option for travellers connecting into the Cape Town metro area.",
        location: "5 Mispel Road, Bellville, Cape Town",
      },
    ],
  },
  "cape-town": {
    areaLabel: "Cape Town City Centre / Foreshore",
    places: [
      {
        name: "Belly of the Beast",
        kind: "eat",
        subtype: "Restaurant",
        note: "City-centre dining experience within the wider Cape Town Station tourism area.",
        location: "110 Harrington Street, Cape Town City Centre",
      },
      {
        name: "Southern Sun Cape Sun",
        kind: "stay",
        subtype: "Hotel",
        note: "Central-city hotel option close to the station and major Cape Town visitor connections.",
        location: "23 Strand Street, Cape Town City Centre",
      },
    ],
  },
};

export const REMOTE_STOP_NOTES: Record<string, string> = {
  merriman: "Remote railway siding. No useful nearby restaurant or accommodation listing was verified for the prototype.",
  hutchinson: "Remote junction. Victoria West is the nearest meaningful visitor centre, so a road transfer would be required.",
  "leeu-gamka": "Small Karoo rail settlement. Local listings are intentionally withheld until they can be verified with tourism partners.",
  "prince-albert-road": "The station is far from Prince Albert town itself. Accommodation and dining in Prince Albert require a significant road transfer.",
};

export function localDiscovery(stopId: string): LocalDiscovery | undefined {
  return LOCAL_DISCOVERY[stopId];
}

export function remoteStopNote(stopId: string): string | undefined {
  return REMOTE_STOP_NOTES[stopId];
}

export function mapsSearchUrl(place: LocalPlace): string {
  const query = encodeURIComponent(`${place.name}, ${place.location}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
