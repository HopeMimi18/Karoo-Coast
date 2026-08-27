export type LocalPlaceKind = "attraction" | "eat" | "stay";

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
 * Curated prototype discovery data for station-area tourism.
 * - attraction entries are editorial tourism picks.
 * - eat/stay entries demonstrate the future paid-partner inventory model.
 *
 * Prototype business examples do NOT imply that the businesses currently
 * sponsor or endorse Karoo & Coast. Production placements should be sold,
 * verified and clearly disclosed as sponsored/partner content.
 */
export const LOCAL_DISCOVERY: Record<string, LocalDiscovery> = {
  pretoria: {
    areaLabel: "Pretoria Central / Salvokop",
    places: [
      {
        name: "Freedom Park",
        kind: "attraction",
        subtype: "Heritage & culture",
        note: "A major national heritage landscape overlooking the Salvokop and Pretoria Station precinct.",
        location: "Salvokop, Pretoria",
      },
      {
        name: "Melrose House Museum",
        kind: "attraction",
        subtype: "Museum",
        note: "Historic house museum within the central Pretoria visitor area and close to the main station.",
        location: "275 Jeff Masemola Street, Pretoria Central",
      },
      {
        name: "Voortrekker Monument",
        kind: "attraction",
        subtype: "Heritage landmark",
        note: "Major Pretoria landmark with panoramic views, museum experiences and South African historical interpretation.",
        location: "Eeufees Road, Groenkloof, Pretoria",
      },
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
        name: "Constitution Hill",
        kind: "attraction",
        subtype: "Heritage & human rights",
        note: "Museum, former prison complex and Constitutional Court precinct linking the city to South Africa's democratic story.",
        location: "11 Kotze Street, Braamfontein, Johannesburg",
      },
      {
        name: "Sci-Bono Discovery Centre",
        kind: "attraction",
        subtype: "Science & family",
        note: "Interactive science centre in nearby Newtown that adds a family-friendly city experience to a Johannesburg stopover.",
        location: "Helen Joseph Street, Newtown, Johannesburg",
      },
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
    areaLabel: "Klerksdorp / Matlosana",
    places: [
      {
        name: "Klerksdorp Museum",
        kind: "attraction",
        subtype: "Museum & heritage",
        note: "The former Old Klerksdorp Prison now interprets local history, cultural heritage, prison history and Khoisan rock art.",
        location: "Klerksdorp Museum, Klerksdorp",
      },
      {
        name: "Faan Meintjes Nature Reserve",
        kind: "attraction",
        subtype: "Nature reserve",
        note: "A wider Klerksdorp-area nature experience for travellers turning a rail stop into a half-day or overnight excursion.",
        location: "Faan Meintjes Nature Reserve, Klerksdorp",
      },
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
        name: "Bloemhof Dam Nature Reserve",
        kind: "attraction",
        subtype: "Nature & water",
        note: "Dam and grassland reserve known for waterbirds, game viewing, angling and broad Highveld landscapes.",
        location: "Bloemhof Dam Nature Reserve, Bloemhof",
      },
      {
        name: "Sandveld Nature Reserve",
        kind: "attraction",
        subtype: "Nature reserve",
        note: "Wildlife and birding destination around the Bloemhof Dam environment.",
        location: "Sandveld Nature Reserve, Bloemhof",
      },
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
    areaLabel: "Christiana / Vaal River",
    places: [
      {
        name: "Diggers' Diamond Museum",
        kind: "attraction",
        subtype: "Diamond heritage",
        note: "Local museum interpreting Christiana's diamond-digging history and early mining equipment.",
        location: "Christiana, North West",
      },
      {
        name: "Vaal River at Christiana",
        kind: "attraction",
        subtype: "River experience",
        note: "The river is one of Christiana's defining visitor experiences, supporting fishing, boating and waterside leisure.",
        location: "Vaal River, Christiana, North West",
      },
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
    areaLabel: "Warrenton / Vaal-Harts",
    places: [
      {
        name: "Vaal-Harts Dam",
        kind: "attraction",
        subtype: "Water & engineering",
        note: "Part of the Vaalharts irrigation story — a strong fit for Karoo & Coast's water and infrastructure narrative.",
        location: "Vaal-Harts Dam, Warrenton, Northern Cape",
      },
      {
        name: "Nazareth House Mission Station",
        kind: "attraction",
        subtype: "Local heritage",
        note: "Historic mission site outside Warrenton that adds a lesser-known local heritage stop to the route.",
        location: "Nazareth House Mission Station, Warrenton",
      },
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
        name: "The Big Hole & Kimberley Mine Museum",
        kind: "attraction",
        subtype: "Diamond heritage",
        note: "Kimberley's signature visitor experience, combining the historic mine, viewing platform, museum and reconstructed Old Town.",
        location: "West Circular Road, Kimberley",
      },
      {
        name: "McGregor Museum",
        kind: "attraction",
        subtype: "Museum",
        note: "Major regional museum with natural-history, archaeology and cultural-history collections connected to the Northern Cape.",
        location: "Atlas Street, Belgravia, Kimberley",
      },
      {
        name: "William Humphreys Art Gallery",
        kind: "attraction",
        subtype: "Art & culture",
        note: "A cultural stop that broadens Kimberley's visitor experience beyond its diamond history.",
        location: "Cullinan Crescent, Civic Centre, Kimberley",
      },
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
    areaLabel: "Orange River Station / Hopetown",
    accessNote: "The rail stop sits outside the main Hopetown visitor cluster; allow for local road transfer when planning a stopover.",
    places: [
      {
        name: "Star of South Africa Marker",
        kind: "attraction",
        subtype: "Diamond heritage",
        note: "A Church Street window preserves the cutting mark used to test the famous Star of South Africa diamond.",
        location: "33 Church Street, Hopetown",
      },
      {
        name: "Old Wagon Bridge",
        kind: "attraction",
        subtype: "Historic landmark",
        note: "Historic Orange River crossing that predates the Anglo-Boer War and reinforces the route's transport story.",
        location: "Old Wagon Bridge, Hopetown",
      },
      {
        name: "Orange River Station Blockhouse",
        kind: "attraction",
        subtype: "Rail & conflict heritage",
        note: "A route-specific heritage point connecting the railway corridor to the South African War story.",
        location: "Orange River Station, near Hopetown",
      },
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
        name: "Olive Schreiner House",
        kind: "attraction",
        subtype: "Literary heritage",
        note: "A local heritage stop connected to the influential South African author who lived in De Aar.",
        location: "Grundlingh Street, De Aar",
      },
      {
        name: "Garden of Remembrance",
        kind: "attraction",
        subtype: "War memorial",
        note: "Memorial space connected to British troops who died during the South African War.",
        location: "Garden of Remembrance, De Aar",
      },
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
    areaLabel: "Beaufort West / Cape Karoo",
    places: [
      {
        name: "Karoo National Park",
        kind: "attraction",
        subtype: "National park",
        note: "A major Cape Karoo nature experience with mountain landscapes, wildlife, fossils and dark-sky potential.",
        location: "Karoo National Park, Beaufort West",
      },
      {
        name: "Beaufort West Museum",
        kind: "attraction",
        subtype: "Museum & local history",
        note: "Museum complex that includes the Chris Barnard and medical-science story as well as local cultural history.",
        location: "87 Donkin Street, Beaufort West",
      },
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
        name: "Laingsburg Flood Museum",
        kind: "attraction",
        subtype: "Museum",
        note: "Interprets the devastating 1981 flood and preserves local Africana, geology and town-history collections.",
        location: "Laingsburg Flood Museum, Laingsburg",
      },
      {
        name: "Laingsburg Flood Route",
        kind: "attraction",
        subtype: "Heritage route",
        note: "A route through the town that helps visitors understand the scale and legacy of the 1981 disaster.",
        location: "Laingsburg, Western Cape",
      },
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
    accessNote: "Matjiesfontein is unusually compact: the station, hotel, museums, restaurants and heritage village form one walkable visitor experience.",
    places: [
      {
        name: "Transport Museum",
        kind: "attraction",
        subtype: "Transport heritage",
        note: "Vintage vehicles, royal cars, a steam train and railway carriages make this one of the strongest transport-themed stops on the corridor.",
        location: "Matjiesfontein, Western Cape",
      },
      {
        name: "Marie Rawdon Museum",
        kind: "attraction",
        subtype: "Victorian & war heritage",
        note: "Collection of Victoriana and historical memorabilia housed in the railway-station precinct.",
        location: "Matjiesfontein Railway Station, Matjiesfontein",
      },
      {
        name: "Matjiesfontein Red Bus Tour",
        kind: "attraction",
        subtype: "Heritage experience",
        note: "A short village orientation that turns the stop itself into an experience rather than simply a pause in the journey.",
        location: "Matjiesfontein, Western Cape",
      },
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
    accessNote: "Some nature experiences require a road transfer from the station; Station Mode should show transfer time when live mobility data becomes available.",
    places: [
      {
        name: "Aquila Private Game Reserve",
        kind: "attraction",
        subtype: "Safari & wildlife",
        note: "A major Big Five safari experience in the Touws River area, suitable for a planned day trip or overnight extension.",
        location: "R46, Touws River",
      },
      {
        name: "Drie Kuilen Nature Reserve",
        kind: "attraction",
        subtype: "Nature & outdoor",
        note: "Wider-area Karoo experience with hiking, cycling, birding, rock art and other outdoor activities.",
        location: "Nougaspoort Road, Touws River",
      },
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
    areaLabel: "Worcester / Breede Valley",
    places: [
      {
        name: "Karoo Desert National Botanical Garden",
        kind: "attraction",
        subtype: "Botanical garden",
        note: "A 154-hectare garden showcasing arid-zone biodiversity at the foot of the Hex River Mountain Range.",
        location: "Karoo Desert National Botanical Garden, Worcester",
      },
      {
        name: "Kleinplasie Worcester Museum",
        kind: "attraction",
        subtype: "Living-history museum",
        note: "A heritage experience that interprets traditional rural life, crafts and local history in the Breede Valley.",
        location: "Kleinplasie, Worcester",
      },
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
    areaLabel: "Wellington / Cape Winelands",
    places: [
      {
        name: "Bainskloof Pass",
        kind: "attraction",
        subtype: "Scenic & engineering heritage",
        note: "Historic mountain pass with dramatic views, indigenous vegetation, rock pools and a strong transport-engineering story.",
        location: "Bainskloof Road, Wellington",
      },
      {
        name: "Breytenbach Centre",
        kind: "attraction",
        subtype: "Arts & culture",
        note: "Local cultural centre that helps connect the railway journey to Wellington's creative identity.",
        location: "Breytenbach Centre, Wellington",
      },
      {
        name: "Wellington Museum",
        kind: "attraction",
        subtype: "Local heritage",
        note: "A compact stop for travellers interested in the town's history and wider Winelands heritage.",
        location: "Wellington Museum, Wellington",
      },
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
        name: "Afrikaans Language Monument",
        kind: "attraction",
        subtype: "Language & heritage",
        note: "Iconic Paarl Mountain landmark interpreting the influences that shaped Afrikaans and offering extensive valley views.",
        location: "Gabbema Doordrift Street, Paarl Mountain, Paarl",
      },
      {
        name: "Paarl Mountain Nature Reserve",
        kind: "attraction",
        subtype: "Nature & outdoor",
        note: "Fynbos-rich mountain landscape with hiking, picnic areas and broad views over Paarl and the Winelands.",
        location: "Paarl Mountain Nature Reserve, Paarl",
      },
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
    areaLabel: "Bellville / Tygerberg",
    places: [
      {
        name: "Tygerberg Nature Reserve",
        kind: "attraction",
        subtype: "Nature reserve",
        note: "Urban nature reserve with trails, biodiversity and panoramic views over Cape Town, Table Bay and the mountains.",
        location: "Tygerberg Nature Reserve, Cape Town",
      },
      {
        name: "Cool Runnings",
        kind: "attraction",
        subtype: "Family attraction",
        note: "Africa's first downhill toboggan track and a distinctive family-friendly activity in the Bellville/Tygervalley area.",
        location: "Carl Cronje Drive, Bellville, Cape Town",
      },
      {
        name: "Tyger Waterfront",
        kind: "attraction",
        subtype: "Leisure precinct",
        note: "Dining, walking and leisure precinct that can support shorter metro stopovers before central Cape Town.",
        location: "Tyger Waterfront, Bellville, Cape Town",
      },
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
    areaLabel: "Cape Town City Centre",
    places: [
      {
        name: "Castle of Good Hope",
        kind: "attraction",
        subtype: "Heritage landmark",
        note: "One of the city's major historic landmarks and an easy central-city extension from the station precinct.",
        location: "Darling Street, Cape Town City Centre",
      },
      {
        name: "District Six Museum",
        kind: "attraction",
        subtype: "Museum & social history",
        note: "A powerful community-history experience that connects the city arrival to stories of forced removals, memory and place.",
        location: "25A Buitenkant Street, Cape Town",
      },
      {
        name: "V&A Waterfront",
        kind: "attraction",
        subtype: "Tourism precinct",
        note: "Major harbour visitor precinct linking the rail journey to museums, restaurants, shopping, cruises and onward Cape Town experiences.",
        location: "V&A Waterfront, Cape Town",
      },
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
  merriman: "Remote railway siding. No useful nearby restaurant, accommodation or formal attraction listing was verified for the prototype.",
  hutchinson: "Remote junction. Victoria West is the nearest meaningful visitor centre, so a road transfer would be required.",
  "leeu-gamka": "Small Karoo rail settlement. Local commercial and tourism listings are intentionally withheld until they can be verified with tourism partners.",
  "prince-albert-road": "The station is far from Prince Albert town itself. Tourism, accommodation and dining in Prince Albert require a significant road transfer.",
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
