import { ADMIN_ROLES, type AdminRole } from "@/types/api";

const SESSION_KEY = "lorofy.admin.session.v2";

export interface AdminIdentity {
  id: string;
  email: string;
  username: string;
  role: AdminRole | "USER";
}

export interface AdminSession {
  accessToken: string;
  refreshToken: string;
  identity: AdminIdentity;
}

export function getSession(): AdminSession | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AdminSession;
    if (!parsed?.accessToken || !parsed?.identity) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setSession(session: AdminSession): void {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  window.localStorage.removeItem(SESSION_KEY);
}

export function getCurrentIdentity(): AdminIdentity | null {
  return getSession()?.identity ?? null;
}

export function normalizeRole(value?: string | null): AdminRole | "USER" {
  if (!value) return "USER";
  const cleaned = value.replace(/^ROLE_/, "").trim();

  if (cleaned === "USER") return "USER";

  if ((ADMIN_ROLES as readonly string[]).includes(cleaned)) {
    return cleaned as AdminRole;
  }

  return "USER";
}

export function isUserAdmin(rawRole?: string | null): boolean {
  if (!rawRole) return false;
  const cleaned = rawRole.replace(/^ROLE_/, "").trim();
  return (
    cleaned === "SUPER_ADMIN" ||
    cleaned === "ADMIN" ||
    cleaned === "CONTENT_EDITOR" ||
    cleaned === "SUPPORT" ||
    cleaned === "ANALYST"
  );
}

export interface JwtPayload {
  sub?: string;
  role?: string;
  exp?: number;
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized);
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

export function extractRoleFromJwt(token: string): AdminRole | "USER" {
  const payload = decodeJwt(token);
  return normalizeRole(payload?.role);
}

export function isAccessTokenExpired(token: string): boolean {
  const payload = decodeJwt(token);
  if (!payload?.exp) return false;
  return payload.exp * 1000 <= Date.now() + 15_000;
}
