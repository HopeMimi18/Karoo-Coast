import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LEGS, STOPS } from "@/data/stops";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import SiteHeader from "@/components/SiteHeader";

export const Route = createFileRoute("/passport")({
  head: () => ({
    meta: [
      { title: "Rail passport — collect a stamp at every Cape line station" },
      {
        name: "description",
        content:
          "Your Track 1067 rail passport: collect stamps at all 28 stations and passing moments between Johannesburg and Cape Town, and unlock badges for each leg of the line.",
      },
      { property: "og:title", content: "Rail passport — Track 1067" },
      { property: "og:description", content: "Collect stamps and badges along the 1 546 km Cape main line." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Passport,
});

function Passport() {
  const { user } = useAuth();
  const [stamps, setStamps] = useState<string[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setStamps([]);
      return;
    }
    void supabase
      .from("stamps")
      .select("stop_id")
      .eq("user_id", user.id)
      .then(({ data }) => setStamps((data ?? []).map((r) => r.stop_id as string)));
  }, [user]);

  const toggle = async (stopId: string) => {
    if (!user) return;
    setBusy(stopId);
    if (stamps.includes(stopId)) {
      setStamps((p) => p.filter((s) => s !== stopId));
      await supabase.from("stamps").delete().eq("user_id", user.id).eq("stop_id", stopId);
    } else {
      setStamps((p) => [...p, stopId]);
      await supabase.from("stamps").insert({ user_id: user.id, stop_id: stopId });
    }
    setBusy(null);
  };

  const badges = LEGS.map((leg) => {
    const inLeg = STOPS.filter((s) => s.leg === leg.n);
    const done = inLeg.filter((s) => stamps.includes(s.id)).length;
    return { leg, done, total: inLeg.length, earned: done === inLeg.length };
  });

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 py-10">
        <h1 className="text-5xl leading-none">Rail passport</h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          {stamps.length} of {STOPS.length} stamps collected. Stamp a stop here, or collect it live while you ride.
        </p>

        {!user && (
          <p className="mt-4 rounded-sm border border-border bg-card p-4 text-sm">
            <Link to="/auth" className="text-primary underline-offset-4 hover:underline">
              Sign in
            </Link>{" "}
            to start collecting stamps — they follow you to any device.
          </p>
        )}

        <section className="mt-8">
          <p className="mono-label text-dust">Leg badges</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {badges.map((b) => (
              <div
                key={b.leg.n}
                className={`rounded-sm border p-4 ${b.earned ? "border-primary" : "border-border"} bg-card`}
              >
                <p className="font-mono text-[11px] text-dust">Leg {b.leg.n}</p>
                <p className={`text-xl leading-none ${b.earned ? "text-primary" : ""}`}>{b.leg.title}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{b.leg.sub}</p>
                <div className="mt-3 h-1 w-full rounded-full bg-muted">
                  <div
                    className="h-1 rounded-full bg-primary"
                    style={{ width: `${Math.round((b.done / b.total) * 100)}%` }}
                  />
                </div>
                <p className="mt-1 font-mono text-[10px] text-dust">
                  {b.done}/{b.total} {b.earned ? "· badge earned" : ""}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <p className="mono-label text-dust">Stamps</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {STOPS.map((s) => {
              const has = stamps.includes(s.id);
              return (
                <button
                  key={s.id}
                  disabled={!user || busy === s.id}
                  onClick={() => void toggle(s.id)}
                  className={`flex items-center justify-between gap-2 rounded-sm border px-3 py-2.5 text-left text-xs transition-colors disabled:opacity-60 ${
                    has ? "border-primary bg-primary/10 text-primary" : "border-border bg-card hover:border-primary"
                  }`}
                >
                  <span>
                    <span className="block">{s.name}</span>
                    <span className="font-mono text-[10px] text-dust">
                      {Math.round(s.km)} km · {s.province}
                    </span>
                  </span>
                  <span className="font-mono text-[10px]">{has ? "✓" : "+"}</span>
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
