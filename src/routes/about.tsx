import { createFileRoute, Link } from "@tanstack/react-router";
import { LANGS } from "@/lib/i18n";
import { GATEWAY_KM, ROUTE, TOTAL_KM } from "@/data/route";
import { STOPS } from "@/data/stops";
import { WINDOWCASTS } from "@/data/experience";
import { fmtKm } from "@/lib/journey";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Karoo & Coast — the rail-tourism journey intelligence layer" },
      {
        name: "description",
        content:
          "How Karoo & Coast combines route geometry, GPS matching, WindowCast storytelling, station tourism discovery and global passenger-experience research for the Pretoria-to-Cape Town corridor.",
      },
      { property: "og:title", content: "About Karoo & Coast" },
      {
        property: "og:description",
        content: "Airport-style journey guidance adapted for South African rail tourism.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const INSPIRATION = [
  {
    place: "Japan",
    pattern: "Station collecting",
    use: "Digital stamps make reaching a place part of the experience rather than a passive map interaction.",
    href: "https://www.jreast.co.jp/e/",
  },
  {
    place: "Norway",
    pattern: "Landscape-synchronised storytelling",
    use: "Stories and audio are timed to what passengers are physically passing outside the window.",
    href: "https://www.visitnorway.com/",
  },
  {
    place: "Switzerland · Germany · France",
    pattern: "Digital journey companion",
    use: "The passenger sees progress, next steps and contextual journey information in one place.",
    href: "https://www.sbb.ch/en",
  },
  {
    place: "Schiphol · Heathrow",
    pattern: "Contextual passenger guidance",
    use: "Airport-style wayfinding inspires Station Mode: what happens next and what is useful around the traveller.",
    href: "https://www.schiphol.nl/en/the-schiphol-app/",
  },
] as const;

function About() {
  const stops = STOPS.filter((s) => s.kind === "stop").length;
  return (
    <main className="mx-auto min-h-dvh max-w-3xl px-5 py-14">
      <Link to="/" className="mono-label text-primary hover:underline">
        ← back to the train
      </Link>
      <h1 className="mt-6 text-5xl leading-none">
        Karoo <span className="text-primary">&amp; Coast</span>
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        A digital rail journey companion that combines transport-style journey awareness with South African tourism,
        local stories and cultural discovery. The product thesis is simple: <span className="text-sand">MOVE → DISCOVER → EXPERIENCE</span>.
      </p>

      <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-sm bg-border sm:grid-cols-5">
        {[
          [fmtKm(TOTAL_KM), "journey corridor"],
          [String(ROUTE.length), "route points"],
          [`${stops} + ${STOPS.length - stops}`, "stops + moments"],
          [String(WINDOWCASTS.length), "WindowCasts"],
          [String(LANGS.length), "languages"],
        ].map(([v, k]) => (
          <div key={k} className="bg-card px-3 py-3">
            <dt className="font-mono text-lg text-sand">{v}</dt>
            <dd className="text-[11px] text-muted-foreground">{k}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-12 space-y-8 leading-relaxed text-foreground/85">
        <div>
          <p className="mono-label text-dust">The differentiator</p>
          <h2 className="mt-2 text-3xl text-foreground">A rail-tourism intelligence layer, not another map.</h2>
          <p className="mt-2">
            WindowCast links the traveller's route position to upcoming moments, window guidance and the right story
            at the right time. Station Mode then turns arrival into discovery by connecting a stop to local heritage,
            culture and tourism opportunities. The defensible asset is the growing corridor dataset behind those
            experiences: route geometry, geofences, landmarks, tourism knowledge and community stories.
          </p>
        </div>

        <div>
          <h2 className="text-2xl text-foreground">Pretoria first, with transparent map accuracy</h2>
          <p className="mt-2">
            The hackathon brief starts in Pretoria, so Karoo & Coast now starts at Pretoria Station. The first
            approximately {Math.round(GATEWAY_KM)} km are shown as a station-to-station Pretoria–Johannesburg gateway
            schematic based on public Gautrain station coordinates. From Johannesburg Park Station south, the
            detailed Cape main-line geometry is based on OpenStreetMap relation 950176. The interface labels this
            distinction instead of pretending the whole route has the same geometry precision.
          </p>
        </div>

        <div>
          <h2 className="text-2xl text-foreground">GPS is optional; demo mode always works</h2>
          <p className="mt-2">
            Judges and travellers can run the complete journey as a simulation. A separate “I'm on the train” mode
            asks the browser for location permission and snaps the device to the nearest sampled route point when it
            is close enough to the corridor. It is a prototype positioning layer, not a claim of live railway
            operational tracking.
          </p>
        </div>

        <div>
          <h2 className="text-2xl text-foreground">Localisation as heritage</h2>
          <p className="mt-2">
            The interface supports {LANGS.map((l) => l.native).join(", ")}. Selected stop lead lines are localised and
            browser speech synthesis can read stories aloud where a suitable voice is available. Names such as
            eGoli, !Gariep, Gamka, Hoerikwaggo and ||Hui !Gaeb are treated as heritage content, not decorative translation.
          </p>
        </div>
      </section>

      <section className="mt-14">
        <p className="mono-label text-dust">Research translated into product decisions</p>
        <h2 className="mt-2 text-3xl">Global patterns, South African purpose</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {INSPIRATION.map((item) => (
            <a
              key={item.place}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-sm border border-border bg-card p-4 hover:border-primary"
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-primary">{item.place}</p>
              <h3 className="mt-1 text-xl">{item.pattern}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.use}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-sm border border-primary/40 bg-card p-5">
        <p className="mono-label text-primary">Hackathon position</p>
        <blockquote className="mt-2 font-display text-2xl leading-snug text-sand">
          “Your train journey becomes part of the destination.”
        </blockquote>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Built for Geekulcha's 2027 Train Tourism Hackathon: geomap, animate and localise the Pretoria-to-Cape Town
          rail journey while making the communities, attractions and stories between the endpoints worth discovering.
        </p>
      </section>
    </main>
  );
}
