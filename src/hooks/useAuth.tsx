import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type Profile = { id: string; display_name: string; home_city: string | null };

type AuthValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthValue>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id ?? null;

  const loadProfile = useMemo(
    () => async (id: string | null) => {
      if (!id) {
        setProfile(null);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("id, display_name, home_city")
        .eq("id", id)
        .maybeSingle();
      if (data) {
        setProfile(data as Profile);
        return;
      }
      const fallback =
        (session?.user.user_metadata?.["display_name"] as string | undefined) ??
        session?.user.email?.split("@")[0] ??
        "Traveller";
      const { data: created } = await supabase
        .from("profiles")
        .insert({ id, display_name: fallback })
        .select("id, display_name, home_city")
        .maybeSingle();
      setProfile((created as Profile) ?? null);
    },
    [session],
  );

  useEffect(() => {
    void loadProfile(userId);
  }, [userId, loadProfile]);

  const value: AuthValue = {
    session,
    user: session?.user ?? null,
    profile,
    loading,
    signOut: async () => {
      await supabase.auth.signOut();
      setProfile(null);
    },
    refreshProfile: async () => loadProfile(userId),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
