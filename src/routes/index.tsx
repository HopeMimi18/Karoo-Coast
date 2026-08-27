import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { STOPS, THREADS } from "@/data/stops";
import { MAX_POINTS } from "@/data/quiz";
import { TOTAL_KM, fmtKm } from "@/lib/journey";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import SiteHeader from "@/components/SiteHeader";
import heroTrain from "@/assets/hero-train.jpg";
import biomeGariep from "@/assets/biome-gariep.jpg";
import biomeKaroo from "@/assets/biome-karoo.jpg";
import biomeFynbos from "@/assets/biome-fynbos.jpg";
import trainInterior from "@/assets/train-interior.jpg";

const RESEARCH_BADGES = ["Japan", "Norway", "Switzerland", "Germany", "France", "Schiphol", "Heathrow"];

const FEATURE_PILLARS = [
  {
    kicker: "MOVE",
    title: "Journey Intelligence",
    body: "Airport-style awareness for rail: route progress, next station, time awareness, distance remaining and GPS-ready travel mode.",
  },
  {
    kicker: "DISCOVER",
    title: "WindowCast™",
    body: "Location-triggered storytelling that tells travellers when to look outside, what they are passing and why each place matters.",
  },
  {
    kicker: "EXPERIENCE",
    title: "Station Mode",
    body: "Every stop becomes a discovery point with nearby attractions, restaurants, hotels and B&Bs, heritage, local culture, passport stamps and route-specific stories.",
  },
] as const;

const BIOMES = [
  {
    img: biomeGariep,
    alt: "A real photograph of the Orange River in South Africa",
    km: "around km 660 · !Gariep / Orange River",
    title: "The Orange River crossing",
    body: "A threshold moment on the route where landscape, water and history begin to change together.",
  },
  {
    img: biomeKaroo,
    alt: "A real photograph of the Great Karoo landscape in South Africa",
    km: "around km 950 · Great Karoo",
    title: "Great Karoo",
    body: "Wide horizons, dry air and a slower rhythm create the atmospheric heart of the long-distance rail experience.",
  },
  {
    img: biomeFynbos,
    alt: "A real photograph of vineyards and mountain scenery in the Cape Winelands",
    km: "around km 1 380 · Hex River / Winelands",
    title: "Cape mountains & vineyards",
    body: "As the line nears the Cape, the journey becomes greener, more layered and unmistakably scenic.",
  },
  {
    img: trainInterior,
    alt: "A real photograph taken inside a South African train carriage",
    km: "on board · the social journey",
    title: "Life in the coach",
    body: "The platform is not only about the map — it also celebrates the feeling of travelling by train through South Africa.",
  },
] as const;

const CARDS = [
  {
    to: "/journey",
    kicker: "01",
    title: "Ride the line",
    body: "Journey Intelligence, GPS route matching and WindowCast alerts bring the route to life as landmarks and stories approach.",
  },
  {
    to: "/plan",
    kicker: "02",
    title: "Plan your trip",
    body: "Pick the stops and interests that matter to you and build a saved itinerary with distances and arrival times.",
  },
  {
    to: "/passport",
    kicker: "03",
    title: "Rail passport",
    body: "Collect a stamp at every station you reach. Track your progress down the line and earn journey badges.",
  },
  {
    to: "/quiz",
    kicker: "04",
    title: "Route challenge",
    body: "Ten questions drawn from the line itself — gauge, diamonds, mountains and names. Points land on the leaderboard.",
  },
  {
    to: "/stories",
    kicker: "05",
    title: "Community stories",
    body: "Add your own memory of a station and read what other travellers left behind at the same platform.",
  },
  {
    to: "/threads",
    kicker: "06",
    title: "Four threads",
    body: "Diamonds, water, names and conflict — the storylines that run the whole length of the track.",
  },
] as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Karoo & Coast — interactive Pretoria to Cape Town rail journey" },
      {
        name: "description",
        content:
          "A digital rail journey companion for Pretoria to Cape Town: animated mapping, route-aware WindowCast storytelling, station tourism discovery, multilingual content and a digital passport.",
      },
      { property: "og:title", content: "Karoo & Coast — ride, plan, collect, share" },
      {
        property: "og:description",
        content: "An interactive rail tourism companion for the Pretoria-to-Cape Town journey corridor.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { user, profile } = useAuth();
  const [stamps, setStamps] = useState(0);
  const [points, setPoints] = useState(0);
  const [trips, setTrips] = useState(0);
  const [board, setBoard] = useState<{ name: string; points: number }[]>([]);

  useEffect(() => {
    if (!user) {
      setStamps(0);
      setPoints(0);
      setTrips(0);
      return;
    }

    void (async () => {
      const [s, q, t] = await Promise.all([
        supabase.from("stamps").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("quiz_results").select("points").eq("user_id", user.id),
        supabase.from("trips").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);
      setStamps(s.count ?? 0);
      setPoints((q.data ?? []).reduce((sum, r) => sum + (r.points as number), 0));
      setTrips(t.count ?? 0);
    })();
  }, [user]);

  useEffect(() => {
    void (async () => {
      const { data } = await supabase.from("quiz_results").select("user_id, points");
      const { data: people } = await supabase.from("profiles").select("id, display_name");
      const names = new Map((people ?? []).map((p) => [p.id as string, p.display_name as string]));
      const totals = new Map<string, number>();

      for (const row of data ?? []) {
        const id = row.user_id as string;
        totals.set(id, (totals.get(id) ?? 0) + (row.points as number));
      }

      setBoard(
        [...totals.entries()]
          .map(([id, p]) => ({ name: names.get(id) ?? "Traveller", points: p }))
          .sort((a, b) => b.points - a.points)
          .slice(0, 5),
      );
    })();
  }, [user]);

  const stopCount = useMemo(() => STOPS.filter((s) => s.kind === "stop").length, []);
  const passingMoments = STOPS.length - stopCount;
  const highlightedStops = useMemo(
    () => ["Pretoria", "Kimberley", "Beaufort West", "Matjiesfontein", "Cape Town"],
    [],
  );

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />

      {/* HERO — modernist editorial: image bleeds from the right, type owns the bottom-left */}
      <section className="relative flex min-h-[82vh] flex-col justify-end overflow-hidden border-b border-primary/20 px-5 py-12 sm:px-10 sm:py-16">
        <div className="absolute inset-y-0 right-0 w-full sm:w-2/3">
          <img
            src={heroTrain}
            alt="Real landscape photograph from the Cape rail corridor: vineyards and mountain scenery"
            className="h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/10" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <p className="mono-label text-primary">Geekulcha Train Tourism · Pretoria → Cape Town</p>
          <h1 className="mt-5 max-w-3xl text-6xl leading-[0.86] italic sm:text-8xl">
            Karoo
            <span className="block not-italic text-sand">&amp; Coast</span>
          </h1>
          <p className="mt-8 max-w-md text-base leading-relaxed text-foreground/80 sm:text-lg">
            A curated rail passage from the highveld of Pretoria to the Atlantic shore of Cape Town —
            {" "}{fmtKm(TOTAL_KM)} of mapped corridor, live journey guidance and place-based storytelling.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/journey"
              className="bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-sand"
            >
              Board the train
            </Link>
            {!user && (
              <Link
                to="/auth"
                className="border border-sand/50 px-8 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-sand transition-colors hover:bg-sand hover:text-background"
              >
                Get your passport
              </Link>
            )}
            <Link
              to="/plan"
              className="border border-sand/50 px-8 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-sand transition-colors hover:bg-sand hover:text-background"
            >
              Plan a trip
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap gap-2 font-mono text-[10px]">
            {["Journey Intelligence", "WindowCast™", "Station Mode", "Offline-friendly", "GPS-ready"].map((label) => (
              <span key={label} className="border border-border px-2.5 py-1 text-sand backdrop-blur">
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* JOURNEY BOARD — ivory band, departure-board typography */}
      <section className="bg-sand text-background">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-10 sm:py-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 className="text-4xl leading-none">Journey Board</h2>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Live route status</p>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-background/70">
              Airport-style awareness for rail — progress, next station, distance remaining and travel mode.
            </p>
            <Link
              to="/journey"
              className="mt-6 inline-block border-b border-primary pb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-primary"
            >
              Open live ride →
            </Link>
          </div>

          <div className="space-y-8 md:col-span-8">
            <BoardRow left="Departure" leftValue="Pretoria Central" right="Status" rightValue="On schedule" divider />
            <BoardRow left="Next signature stop" leftValue="Kimberley" right="Travel mode" rightValue="Simulated / GPS" divider />
            <BoardRow left="Destination" leftValue="Cape Town Terminus" right="Corridor distance" rightValue={fmtKm(TOTAL_KM)} />

            <div className="grid gap-px border border-background/10 bg-background/10 sm:grid-cols-4">
              <BoardTile value={fmtKm(TOTAL_KM)} label="corridor distance" />
              <BoardTile value={`${stopCount}`} label="station stops" />
              <BoardTile value={`${passingMoments}`} label="passing moments" />
              <BoardTile value="5" label="supported languages" />
            </div>

            <div>
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-background/60">
                <span>Route progress</span>
                <span>Move → Discover → Experience</span>
              </div>
              <div className="mt-3 h-1 w-full bg-background/15">
                <div className="h-1 w-[22%] bg-primary" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2 font-mono text-[10px] text-background/70">
                {highlightedStops.map((stop) => (
                  <span key={stop} className="border border-background/20 px-2.5 py-1">
                    {stop}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PILLARS — edge-to-edge triptych with colour-fill hover */}
      <section className="grid grid-cols-1 md:grid-cols-3">
        {FEATURE_PILLARS.map((item, i) => (
          <article
            key={item.title}
            className={[
              "group cursor-default border-t border-border p-8 transition-colors duration-500 sm:p-12",
              i > 0 ? "md:border-l" : "",
              i === 0 ? "hover:bg-accent" : i === 1 ? "hover:bg-primary" : "hover:bg-sand",
            ].join(" ")}
          >
            <span
              className={[
                "block font-mono text-xs uppercase tracking-[0.2em]",
                i === 1 ? "text-sand" : i === 2 ? "text-accent" : "text-primary",
                i === 0 ? "group-hover:text-foreground" : "group-hover:text-background",
              ].join(" ")}
            >
              0{i + 1} · {item.kicker}
            </span>
            <h3
              className={[
                "mt-6 text-4xl leading-none",
                i === 1 ? "" : "italic",
                i === 0 ? "group-hover:text-foreground" : "group-hover:text-background",
              ].join(" ")}
            >
              {item.title}
            </h3>
            <p
              className={[
                "mt-6 text-sm leading-relaxed text-muted-foreground",
                i === 0 ? "group-hover:text-foreground/90" : "group-hover:text-background/80",
              ].join(" ")}
            >
              {item.body}
            </p>
            <div className="mt-12 h-px w-full bg-primary/30 transition-colors group-hover:bg-background/40" />
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-10">
        <div className="grid gap-5 lg:grid-cols-[1.05fr_1.95fr] lg:items-end">
          <div>
            <p className="mono-label text-dust">Why it stands out</p>
            <h2 className="mt-2 text-3xl leading-tight sm:text-4xl">
              Not just a map — a premium journey companion built around the railway itself.
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Karoo & Coast combines airport-style journey guidance, route-aware storytelling and local tourism discovery.
            The result is more immersive than a normal tourism app and more experiential than a traditional railway app.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-6">
          <p className="mono-label text-dust">Research lens</p>
          <div className="flex flex-wrap gap-2 font-mono text-[10px]">
            {RESEARCH_BADGES.map((item) => (
              <span key={item} className="border border-border px-2.5 py-1 text-sand">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>



      <section className="mx-auto max-w-6xl px-5 pb-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mono-label text-dust">Real route scenes</p>
            <h2 className="mt-2 text-3xl leading-tight sm:text-4xl">A more editorial, less template-like homepage</h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            The homepage now leans into real place imagery and a magazine-style content rhythm instead of generic hero cards.
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="overflow-hidden rounded-sm border border-border bg-card">
            <img src={biomeKaroo} alt={BIOMES[1].alt} width={1000} height={718} className="h-72 w-full object-cover sm:h-80" />
            <div className="grid gap-4 p-5 sm:grid-cols-[1fr_1.2fr]">
              <div>
                <p className="font-mono text-[11px] text-dust">Signature landscape</p>
                <h3 className="mt-2 text-3xl leading-none">The Great Karoo</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                The route’s middle stretch becomes a storytelling asset in its own right — ideal for WindowCast alerts,
                astronomy narratives, heritage content and memorable slow-travel branding.
              </p>
            </div>
          </article>

          <div className="grid gap-4">
            <article className="rounded-sm border border-border bg-card p-5">
              <p className="mono-label text-dust">Signature moments</p>
              <div className="mt-4 space-y-3 text-sm">
                <MiniMoment title="LOOK OUTSIDE" body="Orange River crossing, geology shifts and water stories unlocked." />
                <MiniMoment title="ARRIVING SOON" body="Station Mode opens nearby attractions, food, heritage and stop-specific ideas." />
                <MiniMoment title="COLLECT" body="Digital passport stamps and route quizzes deepen the tourism experience." />
              </div>
            </article>
            <article className="rounded-sm border border-border bg-card p-5">
              <p className="mono-label text-dust">Design direction</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                The refreshed layout uses tighter hierarchy, cleaner editorial spacing, richer surfaces and more focused
                calls-to-action to make the product feel more premium.
              </p>
            </article>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {BIOMES.filter((_, index) => index !== 1).map((b) => (
            <figure key={b.title} className="overflow-hidden rounded-sm border border-border bg-card">
              <img src={b.img} alt={b.alt} loading="lazy" width={1000} height={750} className="h-48 w-full object-cover" />
              <figcaption className="p-4">
                <p className="font-mono text-[11px] text-dust">{b.km}</p>
                <h3 className="mt-1 text-xl leading-none">{b.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{b.body}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-10">
        <div className="rounded-sm border border-border bg-card p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr] lg:items-start">
            <div>
              <p className="mono-label text-dust">
                {user ? `Kicking off, ${profile?.display_name ?? "traveller"}` : "Your journey starts here"}
              </p>
              <h2 className="mt-2 text-3xl leading-tight sm:text-4xl">Turn a rail route into a personal travel experience.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Save routes, collect stamps, answer quizzes and leave memories behind at stations. The product is designed
                to feel like a real travel companion rather than a simple demo.
              </p>
            </div>
            <div className="rounded-sm border border-border bg-background/40 p-4">
              <p className="font-mono text-[11px] text-dust">What travellers can do</p>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-muted-foreground">
                <li>• Track progress and upcoming stops</li>
                <li>• Unlock local stories and landmarks on the move</li>
                <li>• Explore station-area tourism opportunities</li>
                <li>• Build a memorable digital rail passport</li>
              </ul>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <Progress label="Stamps collected" value={stamps} total={STOPS.length} to="/passport" />
            <Progress label="Quiz points" value={points} total={MAX_POINTS} to="/quiz" />
            <Progress label="Saved trips" value={trips} total={Math.max(trips, 3)} to="/plan" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mono-label text-dust">Explore the platform</p>
            <h2 className="mt-2 text-3xl leading-tight sm:text-4xl">Six modules, one connected travel experience</h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Each module supports the same core idea: make the Pretoria-to-Cape Town rail corridor informative,
            discoverable and memorable.
          </p>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="group rounded-sm border border-border bg-card p-5 transition-colors hover:border-primary"
            >
              <span className="font-mono text-[11px] text-dust">{c.kicker}</span>
              <h3 className="mt-2 text-2xl leading-none group-hover:text-primary">{c.title}</h3>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{c.body}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-5 pb-16 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-sm border border-border bg-card p-5">
          <p className="mono-label text-dust">Storylines along the track</p>
          <h2 className="mt-2 text-2xl leading-none">A tourism platform with narrative depth</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {THREADS.map((th) => (
              <span
                key={th.id}
                className="rounded-full border px-3 py-1 text-[11px]"
                style={{ borderColor: th.color, color: th.color }}
              >
                {th.label}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Travellers can follow the route through themes such as water, diamonds, names and conflict, giving the
            platform a richer educational and cultural layer than a normal tourism website.
          </p>
        </div>

        <div className="rounded-sm border border-border bg-card p-5">
          <p className="mono-label text-dust">Leaderboard</p>
          <h2 className="mt-2 text-2xl leading-none">Top travellers</h2>
          {board.length === 0 ? (
            <p className="mt-3 text-xs text-muted-foreground">No scores yet — be the first down the line.</p>
          ) : (
            <ol className="mt-4 space-y-2 font-mono text-xs">
              {board.map((row, i) => (
                <li key={`${row.name}-${i}`} className="flex items-center justify-between rounded-sm border border-border px-3 py-2">
                  <span className="text-muted-foreground">
                    {i + 1}. {row.name}
                  </span>
                  <span className="text-sand">{row.points}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      <footer className="border-t border-border px-5 py-8 text-center font-mono text-[11px] text-dust">
        Karoo & Coast ·{" "}
        <Link to="/about" className="text-primary underline-offset-4 hover:underline">
          how it was built
        </Link>{" "}
        · built for the Geekulcha Train Tourism Hackathon
      </footer>
    </div>
  );
}

function MetricTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-sm border border-border bg-card/70 p-4 backdrop-blur">
      <div className="text-2xl text-sand">{value}</div>
      <div className="mt-1 font-mono text-[11px] text-dust">{label}</div>
    </div>
  );
}

function DashboardStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-border bg-background/40 p-3">
      <p className="font-mono text-[10px] text-dust">{label}</p>
      <p className="mt-1 text-sm text-foreground">{value}</p>
    </div>
  );
}

function MiniMoment({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-sm border border-border bg-background/40 p-3">
      <p className="font-mono text-[10px] text-primary">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function Progress({
  label,
  value,
  total,
  to,
}: {
  label: string;
  value: number;
  total: number;
  to: "/passport" | "/quiz" | "/plan";
}) {
  const pct = total ? Math.min(100, Math.round((value / total) * 100)) : 0;
  return (
    <Link to={to} className="block rounded-sm border border-border bg-background/35 p-4 transition-colors hover:border-primary">
      <p className="font-mono text-[11px] text-dust">{label}</p>
      <p className="mt-1 text-3xl text-sand">
        {value}
        <span className="text-base text-dust"> / {total}</span>
      </p>
      <div className="mt-3 h-1 w-full rounded-full bg-muted">
        <div className="h-1 rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
    </Link>
  );
}
