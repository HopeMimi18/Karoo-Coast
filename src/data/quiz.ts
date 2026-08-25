export type Question = {
  id: string;
  stopId: string;
  prompt: string;
  options: string[];
  answer: number;
  points: number;
  note: string;
};

export const QUESTIONS: Question[] = [
  {
    id: "q-gauge",
    stopId: "hex-river-tunnels",
    prompt: "Why is the Cape main line built to a 1 067 mm gauge?",
    options: [
      "It was cheaper and turned tighter through mountain passes",
      "It matched British standard gauge",
      "It was the widest gauge available in 1873",
      "It was chosen for high-speed running",
    ],
    answer: 0,
    points: 20,
    note: "Narrow gauge was cheaper to build and could curve through the Hex River mountains — the choice spread across southern Africa.",
  },
  {
    id: "q-egoli",
    stopId: "johannesburg",
    prompt: "What does the isiZulu name eGoli mean?",
    options: ["Place of water", "Place of gold", "Big meeting", "Windy city"],
    answer: 1,
    points: 10,
    note: "Johannesburg is eGoli — the place of gold. The whole line exists because of what came out of the ground here.",
  },
  {
    id: "q-kimberley",
    stopId: "kimberley",
    prompt: "Kimberley's Big Hole was dug mainly with what?",
    options: ["Dynamite and draglines", "Hand picks, shovels and rope", "Steam shovels", "Hydraulic jets"],
    answer: 1,
    points: 15,
    note: "Tens of thousands of diggers worked the hole by hand — one of the largest hand-dug excavations on earth.",
  },
  {
    id: "q-dear",
    stopId: "de-aar",
    prompt: "What makes De Aar important on the rail network?",
    options: [
      "It is the highest point on the line",
      "It is South Africa's busiest passenger station",
      "It is the junction linking Cape Town, Kimberley and Namibia",
      "It is the coastal terminus",
    ],
    answer: 2,
    points: 15,
    note: "De Aar is the great Karoo junction — the crossroads of the national freight and passenger network.",
  },
  {
    id: "q-karoo",
    stopId: "karoo-night",
    prompt: "Roughly how far does the train run through the Great Karoo?",
    options: ["80 km", "180 km", "400 km", "900 km"],
    answer: 2,
    points: 10,
    note: "About 400 km of semi-desert, most of it crossed in the dark — which is why the Karoo night sky is part of the ride.",
  },
  {
    id: "q-matjiesfontein",
    stopId: "matjiesfontein",
    prompt: "Matjiesfontein was founded in the 1880s as what?",
    options: ["A diamond camp", "A Victorian health and railway resort", "A military fort", "A wine estate"],
    answer: 1,
    points: 15,
    note: "Jimmy Logan built a Victorian spa village around the refreshment stop. It is now a national heritage site.",
  },
  {
    id: "q-hex",
    stopId: "hex-valley",
    prompt: "The Hex River Valley is best known for growing what?",
    options: ["Maize", "Table grapes", "Rooibos", "Sugar cane"],
    answer: 1,
    points: 10,
    note: "The valley is South Africa's table-grape heartland, seen from the train as you drop out of the tunnels.",
  },
  {
    id: "q-orange",
    stopId: "orange-river",
    prompt: "The Orange River is also known by which name?",
    options: ["Limpopo", "Gariep", "Tugela", "Breede"],
    answer: 1,
    points: 15,
    note: "Gariep is the older name — the Nama word for the great river the line crosses on its way south.",
  },
  {
    id: "q-total",
    stopId: "cape-town",
    prompt: "About how long is the Johannesburg to Cape Town rail journey?",
    options: ["846 km", "1 546 km", "2 100 km", "1 067 km"],
    answer: 1,
    points: 10,
    note: "Around 1 546 km along the rails, run in roughly 26 hours.",
  },
  {
    id: "q-beaufort",
    stopId: "beaufort-west",
    prompt: "Beaufort West is the capital of which region?",
    options: ["The Highveld", "The Great Karoo", "The Winelands", "The Overberg"],
    answer: 1,
    points: 10,
    note: "Beaufort West is the largest town in the Great Karoo and the gateway to the Karoo National Park.",
  },
];

export const MAX_POINTS = QUESTIONS.reduce((sum, q) => sum + q.points, 0);
