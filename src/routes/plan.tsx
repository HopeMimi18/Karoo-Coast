import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { STOPS, THREADS, type Thread } from "@/data/stops";
import { clockAtKm, fmtKm } from "@/lib/journey";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import SiteHeader from "@/components/SiteHeader";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "Plan a trip — build your Cape main line itinerary" },
      {
        name: "description",
        content:
          "Choose the stations and storylines that interest you, and Karoo & Coast builds a saved itinerary down the Johannesburg to Cape Town line with distances, arrival times and what to see at each stop.",
      },
      { property: "og:title", content: "Plan a trip — Karoo & Coast" },
      { property: "og:description", content: "Build and save your own rail itinerary along the Cape main line." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Plan,
});

type Trip = { id: string; title: string; stop_ids: string[]; interests: string[]; notes: string | null };

function Plan() {
  const { user } = useAuth();
  const [title, setTitle] = useState("My Cape main line trip");
  const [notes, setNotes] = useState("");
  const [picked, setPicked] = useState<string[]>(["johannesburg", "kimberley", "matjiesfontein", "cape-town"]);
  const [interests, setInterests] = useState<Thread[]>([]);
  const [saved, setSaved] = useState<Trip[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  const loadTrips = async (uid: string) => {
    const { data } = await supabase
      .from("trips")
      .select("id, title, stop_ids, interests, notes")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });
    setSaved((data ?? []) as Trip[]);
  };

  useEffect(() => {
    if (!user) {
      setSaved([]);
      return;
    }
    void loadTrips(user.id);
  }, [user]);

  const suggestions = useMemo(
    () =>
      interests.length === 0
        ? []
        : STOPS.filter((s) => s.threads.some((th) => interests.includes(th)) && !picked.includes(s.id)),
    [interests, picked],
  );

  const itinerary = useMemo(
    () => STOPS.filter((s) => picked.includes(s.id)).sort((a, b) => a.km - b.km),
    [picked],
  );

  const save = async () => {
    if (!user) return;
    setStatus(null);
    const { error } = await supabase.from("trips").insert({
      user_id: user.id,
      title,
      stop_ids: picked,
      interests,
      notes,
    });
    setStatus(error ? error.message : "Trip saved.");
    if (!error) await loadTrips(user.id);
  };

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-10">
        <h1 className="text-5xl leading-none">Plan your trip</h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Pick the storylines you care about, add the stops you want to break the journey at, and keep the itinerary
          in your passport.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="mono-label text-dust">What interests you?</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {THREADS.map((th) => {
                const on = interests.includes(th.id);
                return (
                  <button
                    key={th.id}
                    onClick={() =>
                      setInterests((prev) => (on ? prev.filter((x) => x !== th.id) : [...prev, th.id]))
                    }
                    className="rounded-full border px-3 py-1 text-[11px] transition-opacity"
                    style={{ borderColor: th.color, color: th.color, opacity: on ? 1 : 0.45 }}
                  >
                    {th.label}
                  </button>
                );
              })}
            </div>

            {suggestions.length > 0 && (
              <div className="mt-5 rounded-sm border border-border bg-card p-4">
                <p className="mono-label text-dust">Suggested for you</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {suggestions.slice(0, 10).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setPicked((p) => [...p, s.id])}
                      className="rounded-sm border border-border px-2.5 py-1 text-[11px] hover:border-primary"
                    >
                      + {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p className="mono-label mt-7 text-dust">All stops</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {STOPS.map((s) => {
                const on = picked.includes(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() =>
                      setPicked((p) => (on ? p.filter((x) => x !== s.id) : [...p, s.id]))
                    }
                    className={`flex items-center justify-between gap-2 rounded-sm border px-3 py-2 text-left text-xs ${
                      on ? "border-primary bg-primary/10 text-primary" : "border-border bg-card hover:border-primary"
                    }`}
                  >
                    <span>{s.name}</span>
                    <span className="font-mono text-[10px] text-dust">{Math.round(s.km)} km</span>
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-sm border border-border bg-card p-5">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm"
              />
              <ol className="mt-4 space-y-3">
                {itinerary.map((s, i) => (
                  <li key={s.id} className="hairline pt-3 first:border-0 first:pt-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm">
                        <span className="font-mono text-[10px] text-dust">{String(i + 1).padStart(2, "0")} </span>
                        {s.name}
                      </span>
                      <span className="font-mono text-[10px] text-sand">{clockAtKm(s.km)}</span>
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{s.lead}</p>
                    <p className="mt-1 font-mono text-[10px] text-dust">
                      {fmtKm(s.km)} from Park Station
                      {i > 0 && ` · +${fmtKm(s.km - itinerary[i - 1]!.km)}`}
                    </p>
                  </li>
                ))}
              </ol>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes — who you're travelling with, what you want to see…"
                rows={3}
                className="mt-4 w-full rounded-sm border border-border bg-background px-3 py-2 text-xs"
              />
              {user ? (
                <button
                  onClick={() => void save()}
                  className="mt-3 w-full rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  Save trip
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="mt-3 block rounded-sm border border-border px-4 py-2 text-center text-sm hover:border-primary"
                >
                  Sign in to save this trip
                </Link>
              )}
              {status && <p className="mt-2 text-xs text-sand">{status}</p>}
            </div>

            {saved.length > 0 && (
              <div className="mt-4 rounded-sm border border-border bg-card p-5">
                <p className="mono-label text-dust">Saved trips</p>
                <ul className="mt-2 space-y-2">
                  {saved.map((tr) => (
                    <li key={tr.id} className="flex items-center justify-between gap-2 text-xs">
                      <button
                        onClick={() => {
                          setTitle(tr.title);
                          setPicked(tr.stop_ids);
                          setInterests(tr.interests as Thread[]);
                          setNotes(tr.notes ?? "");
                        }}
                        className="text-left hover:text-primary"
                      >
                        {tr.title}{" "}
                        <span className="font-mono text-[10px] text-dust">{tr.stop_ids.length} stops</span>
                      </button>
                      <button
                        onClick={async () => {
                          await supabase.from("trips").delete().eq("id", tr.id);
                          if (user) await loadTrips(user.id);
                        }}
                        className="font-mono text-[10px] text-dust hover:text-destructive"
                      >
                        remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
