import { createClient, type Session, type User, type SupabaseClient } from '@supabase/supabase-js';

const rawUrl =
  (import.meta.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_URL as string | undefined);
const rawKey =
  (import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
  (import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined);

const isValidUrl = (url?: string): boolean => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export const isSupabaseConfigured = Boolean(
  rawUrl && isValidUrl(rawUrl) && rawKey && rawKey.trim().length > 0
);

// Fallback in-memory and localStorage client for seamless preview/development
class FallbackSupabaseClient {
  private listeners: Array<(event: string, session: Session | null) => void> = [];
  private currentSession: Session | null = null;

  constructor() {
    try {
      const saved = localStorage.getItem('estudovag_auth_session');
      if (saved) {
        this.currentSession = JSON.parse(saved);
      }
    } catch {
      this.currentSession = null;
    }
  }

  private persistSession(session: Session | null) {
    this.currentSession = session;
    try {
      if (session) {
        localStorage.setItem('estudovag_auth_session', JSON.stringify(session));
      } else {
        localStorage.removeItem('estudovag_auth_session');
      }
    } catch (e) {
      console.warn('Falha ao persistir sessão local:', e);
    }
    this.listeners.forEach((listener) => {
      try {
        listener(session ? 'SIGNED_IN' : 'SIGNED_OUT', session);
      } catch (e) {
        console.error(e);
      }
    });
  }

  auth = {
    getSession: async () => {
      return { data: { session: this.currentSession }, error: null };
    },
    onAuthStateChange: (
      callback: (event: string, session: Session | null) => void
    ) => {
      this.listeners.push(callback);
      // Fire immediately with current state
      setTimeout(() => callback(this.currentSession ? 'SIGNED_IN' : 'INITIAL_SESSION', this.currentSession), 0);
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              this.listeners = this.listeners.filter((l) => l !== callback);
            },
          },
        },
      };
    },
    signInWithPassword: async ({ email }: { email: string; password?: string }) => {
      const user: User = {
        id: 'usr_' + Math.abs(email.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)),
        app_metadata: {},
        user_metadata: { nome: email.split('@')[0] || 'Médico(a) Residente' },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        email,
      };
      const session: Session = {
        access_token: 'local_token_' + Date.now(),
        refresh_token: 'local_refresh_' + Date.now(),
        expires_in: 86400,
        token_type: 'bearer',
        user,
      };
      this.persistSession(session);
      return { data: { user, session }, error: null };
    },
    signUp: async ({
      email,
      options,
    }: {
      email: string;
      password?: string;
      options?: { data?: { nome?: string } };
    }) => {
      const user: User = {
        id: 'usr_' + Math.abs(email.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)),
        app_metadata: {},
        user_metadata: { nome: options?.data?.nome || email.split('@')[0] },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        email,
      };
      const session: Session = {
        access_token: 'local_token_' + Date.now(),
        refresh_token: 'local_refresh_' + Date.now(),
        expires_in: 86400,
        token_type: 'bearer',
        user,
      };
      this.persistSession(session);
      return { data: { user, session }, error: null };
    },
    signOut: async () => {
      this.persistSession(null);
      return { error: null };
    },
    resetPasswordForEmail: async (_email: string) => {
      return { error: null };
    },
    updateUser: async () => {
      return { error: null };
    },
    resend: async () => {
      return { error: null };
    },
  };

  from(table: string) {
    return {
      select: () => ({
        eq: (_col: string, id: string) => ({
          maybeSingle: async () => {
            try {
              const saved = localStorage.getItem(`estudovag_${table}_${id}`);
              if (saved) return { data: JSON.parse(saved), error: null };
            } catch {}
            return { data: null, error: null };
          },
        }),
      }),
      update: (data: any) => ({
        eq: async (_col: string, id: string) => {
          try {
            const existing = localStorage.getItem(`estudovag_${table}_${id}`);
            const merged = { ...(existing ? JSON.parse(existing) : {}), ...data };
            localStorage.setItem(`estudovag_${table}_${id}`, JSON.stringify(merged));
          } catch {}
          return { error: null };
        },
      }),
      upsert: async (data: any) => {
        try {
          const id = data?.id || 'default';
          localStorage.setItem(`estudovag_${table}_${id}`, JSON.stringify(data));
        } catch {}
        return { error: null };
      },
    };
  }
}

export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(rawUrl!, rawKey!, {
      auth: {
        flowType: 'pkce',
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : (new FallbackSupabaseClient() as unknown as SupabaseClient);

export const getAuthRedirectUrl = () =>
  (import.meta.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL as string | undefined) ||
  `${window.location.origin}/auth/callback`;

