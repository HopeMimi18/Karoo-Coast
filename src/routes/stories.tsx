import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { STOPS } from "@/data/stops";
import { LANGS, type Lang } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import SiteHeader from "@/components/SiteHeader";

export const Route = createFileRoute("/stories")({
  head: () => ({
    meta: [
      { title: "Community stories from the Pretoria to Cape Town line" },
      {
        name: "description",
        content:
          "Read and add traveller memories from stations along the Cape main line — in English, Afrikaans, isiXhosa, isiZulu or Sesotho.",
      },
      { property: "og:title", content: "Community stories — Track 1067" },
      { property: "og:description", content: "Traveller memories from every station on the Cape main line." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Stories,
});

type Story = {
  id: string;
  user_id: string;
  stop_id: string;
  body: string;
  language: string;
  created_at: string;
};

function Stories() {
  const { user, profile } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});
  const [stopId, setStopId] = useState<string>("kimberley");
  const [filter, setFilter] = useState<string>("all");
  const [body, setBody] = useState("");
  const [language, setLanguage] = useState<Lang>("en");
  const [status, setStatus] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase
      .from("stories")
      .select("id, user_id, stop_id, body, language, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    setStories((data ?? []) as Story[]);
    const { data: people } = await supabase.from("profiles").select("id, display_name");
    setNames(Object.fromEntries((people ?? []).map((p) => [p.id as string, p.display_name as string])));
  };

  useEffect(() => {
    void load();
  }, []);

  const post = async () => {
    if (!user || body.trim().length < 4) return;
    setStatus(null);
    const { error } = await supabase
      .from("stories")
      .insert({ user_id: user.id, stop_id: stopId, body: body.trim(), language });
    if (error) {
      setStatus(error.message);
      return;
    }
    setBody("");
    setStatus("Posted — thank you for adding to the line.");
    await load();
  };

  const shown = filter === "all" ? stories : stories.filter((s) => s.stop_id === filter);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 py-10">
        <h1 className="text-5xl leading-none">Community stories</h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Every station carries more than the official history. Leave your own memory of a platform, a view or a
          journey — in whichever language it happened in.
        </p>

        <section className="mt-8 rounded-sm border border-border bg-card p-5">
          {user ? (
            <>
              <div className="flex flex-wrap gap-2">
                <select
                  value={stopId}
                  onChange={(e) => setStopId(e.target.value)}
                  className="rounded-sm border border-border bg-background px-2 py-1.5 text-xs"
                >
                  {STOPS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Lang)}
                  className="rounded-sm border border-border bg-background px-2 py-1.5 text-xs"
                >
                  {LANGS.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.native}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
                placeholder={`Your memory of this stop, ${profile?.display_name ?? "traveller"}…`}
                className="mt-3 w-full rounded-sm border border-border bg-background px-3 py-2 text-sm"
              />
              <button
                onClick={() => void post()}
                className="mt-3 rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Post story
              </button>
              {status && <p className="mt-2 text-xs text-sand">{status}</p>}
            </>
          ) : (
            <p className="text-sm">
              <Link to="/auth" className="text-primary underline-offset-4 hover:underline">
                Sign in
              </Link>{" "}
              to add your own story. Reading is open to everyone.
            </p>
          )}
        </section>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="mono-label text-dust">Filter</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-sm border border-border bg-card px-2 py-1.5 text-xs"
          >
            <option value="all">All stops</option>
            {STOPS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <ul className="mt-4 space-y-3">
          {shown.length === 0 && (
            <li className="rounded-sm border border-border bg-card p-5 text-sm text-muted-foreground">
              No stories here yet. Be the first voice at this platform.
            </li>
          )}
          {shown.map((s) => {
            const stop = STOPS.find((x) => x.id === s.stop_id);
            return (
              <li key={s.id} className="rounded-sm border border-border bg-card p-5">
                <p className="font-mono text-[11px] text-dust">
                  {stop?.name ?? s.stop_id} · {names[s.user_id] ?? "Traveller"} ·{" "}
                  {new Date(s.created_at).toLocaleDateString("en-ZA")} ·{" "}
                  {LANGS.find((l) => l.id === s.language)?.native ?? s.language}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{s.body}</p>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
