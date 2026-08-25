import { createFileRoute, Link } from "@tanstack/react-router";
import { LEGS, STOPS } from "@/data/stops";
import { clockAtKm, fmtKm } from "@/lib/journey";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "Route guide — every stop from Johannesburg to Cape Town" },
      {
        name: "description",
        content:
          "The full Cape main line stop by stop: five legs, 28 moments, distances, arrival times and what to look for out of the window.",
      },
      { property: "og:title", content: "Route guide — the Cape main line" },
      {
        property: "og:description",
        content: "Five legs, 1 546 km, every stop and passing moment with distances and times.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Guide,
});

function Guide() {
  return (
    <main className="mx-auto min-h-dvh max-w-3xl px-5 py-14">
      <Link to="/" className="mono-label text-primary hover:underline">
        ← back to the train
      </Link>
      <h1 className="mt-6 text-5xl leading-none">Route guide</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Johannesburg Park Station to Cape Town: 1 546 km of 1 067 mm gauge, roughly 26 hours, five legs.
      </p>

      <div className="mt-12 space-y-14">
        {LEGS.map((leg) => (
          <section key={leg.n}>
            <div className="hairline flex items-baseline gap-3 pt-4">
              <span className="font-mono text-xs text-primary">0{leg.n}</span>
              <h2 className="text-2xl">{leg.title}</h2>
            </div>
            <p className="mt-1 text-sm text-sand">{leg.sub}</p>
            <p className="mt-1 text-sm text-muted-foreground">{leg.note}</p>

            <ul className="mt-5 space-y-5">
              {STOPS.filter((s) => s.leg === leg.n).map((s) => (
                <li key={s.id} className="grid grid-cols-[5.5rem_1fr] gap-4">
                  <span className="pt-1 font-mono text-[11px] text-dust">
                    {fmtKm(s.km)}
                    <br />
                    {clockAtKm(s.km)}
                  </span>
                  <div>
                    <h3 className="text-lg">
                      {s.name}
                      {s.kind === "passing" && (
                        <span className="mono-label ml-2 text-dust">passing</span>
                      )}
                    </h3>
                    {s.native && (
                      <p className="font-display text-sand">
                        {s.native}{" "}
                        <span className="font-sans text-xs text-muted-foreground">{s.nativeMeaning}</span>
                      </p>
                    )}
                    <p className="mt-1 text-sm leading-relaxed text-foreground/85">{s.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
