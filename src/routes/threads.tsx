import { createFileRoute, Link } from "@tanstack/react-router";
import { STOPS, THREADS } from "@/data/stops";
import { fmtKm } from "@/lib/journey";

export const Route = createFileRoute("/threads")({
  head: () => ({
    meta: [
      { title: "Four threads — diamonds, names, water and conflict on the Cape line" },
      {
        name: "description",
        content:
          "The Pretoria–Cape Town railway told through four running stories: the diamond money that built it, the names older than the stations, the water that decided every town, and a century of conflict.",
      },
      { property: "og:title", content: "Four threads along the Cape main line" },
      {
        property: "og:description",
        content: "Diamonds, names, water and conflict — the four stories that run the length of the line.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Threads,
});

function Threads() {
  return (
    <main className="mx-auto min-h-dvh max-w-3xl px-5 py-14">
      <Link to="/" className="mono-label text-primary hover:underline">
        ← back to the train
      </Link>
      <h1 className="mt-6 text-5xl leading-none">Four threads</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        A railway is not a list of stations. These four stories run the whole 1 546 km, and every stop on the
        line belongs to at least one of them.
      </p>

      <div className="mt-12 space-y-12">
        {THREADS.map((th) => {
          const stops = STOPS.filter((s) => s.threads.includes(th.id));
          return (
            <section key={th.id} className="hairline pt-5">
              <h2 className="text-2xl" style={{ color: th.color }}>
                {th.label}
              </h2>
              <p className="mt-2 max-w-2xl leading-relaxed text-foreground/85">{th.blurb}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {stops.map((s) => (
                  <li
                    key={s.id}
                    className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                  >
                    {s.name} <span className="font-mono text-[10px] text-dust">{fmtKm(s.km)}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}
