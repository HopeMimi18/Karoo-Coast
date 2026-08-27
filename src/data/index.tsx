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

      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.16),transparent_32%),radial-gradient(circle_at_bottom_right,hsl(var(--accent)/0.08),transparent_28%)]" />
        <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
          <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-start">
            <div>
              <p className="mono-label text-dust">Geekulcha Train Tourism · Pretoria → Cape Town</p>
              <h1 className="mt-4 max-w-4xl text-5xl leading-[0.95] sm:text-7xl">
                South African rail tourism, <span className="text-primary">reimagined like a premium journey system.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Karoo & Coast turns the {fmtKm(TOTAL_KM)} rail corridor into an interactive travel experience. It blends
                journey intelligence inspired by global railway and airport systems with South African attractions,
                cultures, stories and place-based discovery.
              </p>

              <div className="mt-5 flex flex-wrap gap-2 font-mono text-[10px]">
                {["Journey Intelligence", "WindowCast™", "Station Mode", "Offline-friendly", "GPS-ready"].map(
                  (label) => (
                    <span
                      key={label}
                      className="rounded-full border border-border bg-card/70 px-2.5 py-1 text-sand backdrop-blur"
                    >
                      {label}
                    </span>
                  ),
                )}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/journey"
                  className="rounded-sm bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  Board the train
                </Link>
                {!user && (
                  <Link
                    to="/auth"
                    className="rounded-sm border border-border bg-card/50 px-5 py-2.5 text-sm backdrop-blur hover:border-primary"
                  >
                    Get your passport
                  </Link>
                )}
                <Link
                  to="/plan"
                  className="rounded-sm border border-border bg-card/50 px-5 py-2.5 text-sm backdrop-blur hover:border-primary"
                >
                  Plan a trip
                </Link>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-4">
                <MetricTile value={fmtKm(TOTAL_KM)} label="corridor distance" />
                <MetricTile value={`${stopCount}`} label="station stops" />
                <MetricTile value={`${passingMoments}`} label="passing moments" />
                <MetricTile value="5" label="supported languages" />
              </div>
            </div>

            <div className="grid gap-4">
              <article className="overflow-hidden rounded-sm border border-border bg-card shadow-[0_14px_40px_rgba(0,0,0,0.18)]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={heroTrain}
                    alt="Real landscape photograph from the Cape rail journey showing vineyards and mountain scenery"
                    width={1000}
                    height={664}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                    <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-dust">Live corridor preview</p>
                    <h2 className="mt-2 text-2xl leading-none sm:text-3xl">From Pretoria to the Cape</h2>
                    <p className="mt-2 max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      Scenic approach, cultural context and railway awareness come together in a single travel companion.
                    </p>
                  </div>
                </div>
              </article>

              <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                <article className="rounded-sm border border-border bg-card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="mono-label text-dust">Journey board</p>
                      <h3 className="mt-2 text-2xl leading-none">Premium travel guidance</h3>
                    </div>
                    <span className="rounded-full border border-primary/40 px-2 py-1 font-mono text-[10px] text-primary">
                      Prototype
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <DashboardStat label="Current stop" value="Pretoria" />
                    <DashboardStat label="Next signature stop" value="Kimberley" />
                    <DashboardStat label="Travel mode" value="Simulated / GPS" />
                  </div>

                  <div className="mt-5 rounded-sm border border-border bg-background/50 p-4">
                    <div className="flex items-center justify-between gap-3 font-mono text-[11px] text-dust">
                      <span>Route progress</span>
                      <span>MOVE → DISCOVER → EXPERIENCE</span>
                    </div>
                    <div className="mt-3 h-1.5 w-full rounded-full bg-muted">
                      <div className="h-1.5 w-[22%] rounded-full bg-primary" />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                      {highlightedStops.map((stop) => (
                        <span key={stop} className="rounded-full border border-border px-2.5 py-1">
                          {stop}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>

                <article className="rounded-sm border border-border bg-card p-5">
                  <p className="mono-label text-dust">Research lens</p>
                  <h3 className="mt-2 text-2xl leading-none">Global inspiration, local execution</h3>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    Inspired by how other countries guide railway passengers and how airports help people navigate complex
                    journeys — reworked for South African tourism and storytelling.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 font-mono text-[10px]">
                    {RESEARCH_BADGES.map((item) => (
                      <span key={item} className="rounded-full border border-border px-2.5 py-1 text-sand">
                        {item}
                      </span>
                    ))}
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12">
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

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {FEATURE_PILLARS.map((item) => (
            <article key={item.title} className="rounded-sm border border-border bg-card p-5 transition-colors hover:border-primary">
              <p className="font-mono text-[11px] text-primary">{item.kicker}</p>
              <h3 className="mt-2 text-2xl leading-none">{item.title}</h3>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{item.body}</p>
            </article>
          ))}
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
