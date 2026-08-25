import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";

const NAV = [
  { to: "/journey", label: "Live ride" },
  { to: "/plan", label: "Plan a trip" },
  { to: "/passport", label: "Passport" },
  { to: "/quiz", label: "Quiz" },
  { to: "/stories", label: "Stories" },
  { to: "/guide", label: "Guide" },
] as const;

export default function SiteHeader() {
  const { user, profile, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-2 px-5 py-3">
        <Link to="/" className="text-xl leading-none">
          Track <span className="text-primary">1067</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeProps={{ className: "text-primary" }}
              className="hover:text-foreground"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3 font-mono text-[11px]">
          {user ? (
            <>
              <span className="text-sand">{profile?.display_name ?? "Traveller"}</span>
              <button onClick={() => void signOut()} className="text-muted-foreground hover:text-foreground">
                sign out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="rounded-sm bg-primary px-3 py-1.5 text-primary-foreground hover:opacity-90"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
      <div className="ndebele-strip h-1 w-full" />
    </header>
  );
}
