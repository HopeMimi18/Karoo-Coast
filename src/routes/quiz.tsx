import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MAX_POINTS, QUESTIONS } from "@/data/quiz";
import { STOPS } from "@/data/stops";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import SiteHeader from "@/components/SiteHeader";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Route challenge — Cape main line rail trivia" },
      {
        name: "description",
        content:
          "Ten questions about the Johannesburg to Cape Town railway: the 1 067 mm gauge, Kimberley's Big Hole, the De Aar junction, the Hex River tunnels and the names beneath the map.",
      },
      { property: "og:title", content: "Route challenge — Track 1067" },
      { property: "og:description", content: "Test your knowledge of the Cape main line and score points." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Quiz,
});

type Answered = Record<string, { choice: number; correct: boolean; points: number }>;

function Quiz() {
  const { user } = useAuth();
  const [answered, setAnswered] = useState<Answered>({});

  useEffect(() => {
    if (!user) {
      setAnswered({});
      return;
    }
    void supabase
      .from("quiz_results")
      .select("question_id, correct, points")
      .eq("user_id", user.id)
      .then(({ data }) => {
        const next: Answered = {};
        for (const row of data ?? []) {
          const q = QUESTIONS.find((x) => x.id === row.question_id);
          next[row.question_id as string] = {
            choice: row.correct ? (q?.answer ?? -1) : -1,
            correct: row.correct as boolean,
            points: row.points as number,
          };
        }
        setAnswered(next);
      });
  }, [user]);

  const answer = async (questionId: string, choice: number) => {
    const q = QUESTIONS.find((x) => x.id === questionId)!;
    if (answered[questionId]) return;
    const correct = choice === q.answer;
    const points = correct ? q.points : 0;
    setAnswered((prev) => ({ ...prev, [questionId]: { choice, correct, points } }));
    if (user) {
      await supabase
        .from("quiz_results")
        .upsert({ user_id: user.id, question_id: questionId, correct, points }, { onConflict: "user_id,question_id" });
    }
  };

  const score = Object.values(answered).reduce((s, a) => s + a.points, 0);
  const done = Object.keys(answered).length;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-10">
        <h1 className="text-5xl leading-none">Route challenge</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {done}/{QUESTIONS.length} answered · <span className="text-sand">{score}</span> of {MAX_POINTS} points.
          {!user && (
            <>
              {" "}
              <Link to="/auth" className="text-primary underline-offset-4 hover:underline">
                Sign in
              </Link>{" "}
              to save your score to the leaderboard.
            </>
          )}
        </p>

        <ol className="mt-8 space-y-5">
          {QUESTIONS.map((q, i) => {
            const a = answered[q.id];
            const stop = STOPS.find((s) => s.id === q.stopId);
            return (
              <li key={q.id} className="rounded-sm border border-border bg-card p-5">
                <p className="font-mono text-[11px] text-dust">
                  {String(i + 1).padStart(2, "0")} · {stop?.name ?? "the line"} · {q.points} pts
                </p>
                <p className="mt-2 text-lg leading-snug">{q.prompt}</p>
                <div className="mt-3 grid gap-2">
                  {q.options.map((opt, idx) => {
                    const chosen = a?.choice === idx;
                    const isAnswer = idx === q.answer;
                    const style = !a
                      ? "border-border hover:border-primary"
                      : isAnswer
                        ? "border-thread-name text-thread-name"
                        : chosen
                          ? "border-destructive text-destructive"
                          : "border-border opacity-60";
                    return (
                      <button
                        key={opt}
                        disabled={!!a}
                        onClick={() => void answer(q.id, idx)}
                        className={`rounded-sm border px-3 py-2 text-left text-sm transition-colors ${style}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {a && <p className="mt-3 hairline pt-3 text-xs text-muted-foreground">{q.note}</p>}
              </li>
            );
          })}
        </ol>

        {done === QUESTIONS.length && (
          <p className="mt-8 rounded-sm border border-primary bg-card p-5 text-sm">
            Finished — {score}/{MAX_POINTS}.{" "}
            <Link to="/journey" className="text-primary underline-offset-4 hover:underline">
              Ride the line
            </Link>{" "}
            to collect the stamps you're missing.
          </p>
        )}
      </main>
    </div>
  );
}
