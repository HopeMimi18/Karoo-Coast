import { createFileRoute, Link } from "@tanstack/react-router";
import { LANGS } from "@/lib/i18n";
import { ROUTE } from "@/data/route";
import { STOPS } from "@/data/stops";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Karoo & Coast — how the Cape line map was built" },
      {
        name: "description",
        content:
          "How Karoo & Coast works: real OpenStreetMap rail geometry for relation 950176, a 26-hour journey clock, five South African languages, and an interface that follows the sun.",
      },
      { property: "og:title", content: "About Karoo & Coast" },
      {
        property: "og:description",
        content: "Real rail geometry, a live journey clock and five languages behind the Cape main line map.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

function About() {
  const stops = STOPS.filter((s) => s.kind === "stop").length;
  return (
    <main className="mx-auto min-h-dvh max-w-2xl px-5 py-14">
      <Link to="/" className="mono-label text-primary hover:underline">
        ← back to the train
      </Link>
      <h1 className="mt-6 text-5xl leading-none">
        Track <span className="text-primary">1067</span>
      </h1>
      <p className="mt-3 text-muted-foreground">
        1 067 mm is the Cape gauge — the width chosen to get a railway over the Hex River Mountains, and now the
        standard for most of Africa. The whole country south of Johannesburg is shaped by that decision.
      </p>

      <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-sm bg-border sm:grid-cols-4">
        {[
          ["1 546 km", "route length"],
          [String(ROUTE.length), "geometry points"],
          [`${stops} + ${STOPS.length - stops}`, "stops + moments"],
          [String(LANGS.length), "languages"],
        ].map(([v, k]) => (
          <div key={k} className="bg-card px-3 py-3">
            <dt className="font-mono text-lg text-sand">{v}</dt>
            <dd className="text-[11px] text-muted-foreground">{k}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-12 space-y-6 leading-relaxed text-foreground/85">
        <div>
          <h2 className="text-2xl text-foreground">Real geometry, not a drawn line</h2>
          <p className="mt-2">
            The track you see is the actual Cape main line, stitched from OpenStreetMap relation 950176: hundreds
            of way segments chained end to end, then simplified to {ROUTE.length} points with cumulative distance
            at every vertex. That is what makes the position of the train, the distance readout and the arrival
            clock agree with each other.
          </p>
        </div>
        <div>
          <h2 className="text-2xl text-foreground">A journey clock, not a slideshow</h2>
          <p className="mt-2">
            The run departs at 12:30 and takes about 26 hours, so most of the Great Karoo is crossed in darkness —
            which is the truth of this trip, and the reason the interface dims as the train moves. Daylight is
            computed from the journey clock, not from your device.
          </p>
        </div>
        <div>
          <h2 className="text-2xl text-foreground">Localisation as heritage</h2>
          <p className="mt-2">
            The interface speaks {LANGS.map((l) => l.native).join(", ")}, and every stop carries the name that was
            there before the station: eGoli, !Gariep, Gamka, Hoerikwaggo, ||Hui !Gaeb. Lead lines are read aloud
            through the browser's speech synthesis in the selected language where a voice is available.
          </p>
        </div>
        <div>
          <h2 className="text-2xl text-foreground">Built for the Train Tourism Hackathon</h2>
          <p className="mt-2">
            Made for Geekulcha's 2027 Train Tourism Hackathon brief: geomap, animate and localise the Pretoria to
            Cape Town rail journey, and promote domestic tourism by making the country between the endpoints worth
            looking at.
          </p>
        </div>
      </section>
    </main>
  );
}
