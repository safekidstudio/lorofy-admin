import type { AuthProvider } from "@refinedev/core";
import { ApiError, apiRequest, refreshSession } from "@/lib/api-client";
import {
  clearSession,
  decodeJwt,
  getSession,
  isAccessTokenExpired,
  normalizeRole,
  setSession,
} from "@/lib/session";
import type { AuthResponse } from "@/types/api";

interface LoginParams {
  email: string;
  password: string;
}

export const authProvider: AuthProvider = {
  login: async (params: LoginParams) => {
    try {
      const auth = await apiRequest<AuthResponse>("/auth/login", {
        method: "POST",
        body: { email: params.email, password: params.password },
        skipAuth: true,
      });

      // Decode role claim embedded in JWT access token by Spring Security
      const rawRole = auth.role ?? decodeJwt(auth.accessToken)?.role;
      const detectedRole = normalizeRole(rawRole);

      const identity = {
        id: auth.userId,
        email: auth.email,
        username: auth.username,
        role: detectedRole,
      };

      setSession({
        accessToken: auth.accessToken,
        refreshToken: auth.refreshToken,
        identity,
      });

      // Regular USER role redirects to /profile, admins to /dashboard
      const redirectPath = detectedRole === "USER" ? "/profile" : "/dashboard";
      return { success: true, redirectTo: redirectPath };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new Error("Sign in failed. Please try again."),
      };
    }
  },

  logout: async () => {
    const session = getSession();
    try {
      if (session) {
        await apiRequest<void>("/auth/logout", {
          method: "POST",
          body: { refreshToken: session.refreshToken },
        });
      }
    } catch {
      // Token may already be expired — clean local session regardless
    } finally {
      clearSession();
    }
    return { success: true, redirectTo: "/login" };
  },

  check: async () => {
    const session = getSession();
    if (!session) {
      return { authenticated: false, redirectTo: "/login" };
    }

    if (isAccessTokenExpired(session.accessToken)) {
      try {
        const next = await refreshSession();
        if (!next) {
          clearSession();
          return { authenticated: false, redirectTo: "/login" };
        }
      } catch {
        clearSession();
        return { authenticated: false, redirectTo: "/login" };
      }
    }

    return { authenticated: true };
  },

  getIdentity: async () => {
    const session = getSession();
    if (!session) return null;
    return session.identity;
  },

  getPermissions: async () => {
    const session = getSession();
    return session?.identity.role ?? null;
  },

  onError: async (error: unknown) => {
    if (error instanceof ApiError && error.statusCode === 401) {
      clearSession();
      return { logout: true, redirectTo: "/login" };
    }
    return {};
  },
};
