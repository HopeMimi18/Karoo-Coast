import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Karoo & Coast rail passport" },
      {
        name: "description",
        content:
          "Create a free Karoo & Coast account to collect station stamps, save trip plans, answer route quizzes and share your own stories from the Cape main line.",
      },
      { property: "og:title", content: "Sign in to Karoo & Coast" },
      { property: "og:description", content: "Collect stamps, save trips and share stories along the Cape main line." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) void navigate({ to: "/" });
  }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    if (mode === "up") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { display_name: name || email.split("@")[0] },
        },
      });
      setMsg(error ? error.message : "Account created — you're on board.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg(error.message);
    }
    setBusy(false);
  };

  const google = async () => {
    setMsg(null);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      setMsg("Google sign-in failed. Try email instead.");
      return;
    }
    if (result.redirected) return;
    void navigate({ to: "/" });
  };

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5 py-14">
      <Link to="/" className="mb-6 font-mono text-[11px] text-muted-foreground hover:text-foreground">
        ← back home
      </Link>
      <h1 className="text-4xl leading-none">
        {mode === "in" ? "Welcome back" : "Get your rail passport"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Stamps, saved trips, quiz points and your own stories — kept safe across every device.
      </p>

      <button
        onClick={() => void google()}
        className="mt-6 rounded-sm border border-border bg-card px-4 py-2.5 text-sm hover:border-primary"
      >
        Continue with Google
      </button>

      <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-widest text-dust">
        <span className="h-px flex-1 bg-border" /> or email <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={submit} className="space-y-3">
        {mode === "up" && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-sm border border-border bg-card px-3 py-2 text-sm"
          />
        )}
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.co.za"
          className="w-full rounded-sm border border-border bg-card px-3 py-2 text-sm"
        />
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-sm border border-border bg-card px-3 py-2 text-sm"
        />
        <button
          disabled={busy}
          className="w-full rounded-sm bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {mode === "in" ? "Sign in" : "Create account"}
        </button>
      </form>

      {msg && <p className="mt-3 text-xs text-sand">{msg}</p>}

      <button
        onClick={() => setMode(mode === "in" ? "up" : "in")}
        className="mt-5 text-xs text-muted-foreground hover:text-foreground"
      >
        {mode === "in" ? "No account yet? Create one" : "Already have an account? Sign in"}
      </button>
    </main>
  );
}
