import { API_URL } from "@/lib/env";
import {
  type AdminSession,
  clearSession,
  getSession,
  setSession,
} from "@/lib/session";
import type { ApiResponse, AuthResponse } from "@/types/api";

export class ApiError extends Error {
  readonly statusCode: number;
  readonly payload?: unknown;

  constructor(message: string, statusCode: number, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.payload = payload;
  }
}

export type QueryValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | Array<string | number>;

export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, QueryValue>;
  skipAuth?: boolean;
  skipRefresh?: boolean;
  signal?: AbortSignal;
}

let refreshInFlight: Promise<AdminSession | null> | null = null;

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const base = `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const url = new URL(base, window.location.origin);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      for (const item of value) url.searchParams.append(key, String(item));
      continue;
    }
    url.searchParams.set(key, String(value));
  }

  return url.toString();
}

async function parseJson(response: Response): Promise<unknown | null> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function doRefresh(): Promise<AdminSession | null> {
  const session = getSession();
  if (!session?.refreshToken) return null;

  try {
    const response = await fetch(buildUrl("/auth/refresh"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    });

    const json = (await parseJson(
      response,
    )) as ApiResponse<AuthResponse> | null;
    if (!response.ok || !json?.data?.accessToken) {
      clearSession();
      return null;
    }

    const nextSession: AdminSession = {
      ...session,
      accessToken: json.data.accessToken,
      refreshToken: json.data.refreshToken || session.refreshToken,
    };
    setSession(nextSession);
    return nextSession;
  } catch {
    return null;
  }
}

export async function refreshSession(): Promise<AdminSession | null> {
  if (!refreshInFlight) {
    refreshInFlight = doRefresh().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

async function execute(
  path: string,
  options: ApiRequestOptions,
  allowRetry: boolean,
): Promise<Response> {
  const session = getSession();
  const headers = new Headers({ Accept: "application/json" });

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (!options.skipAuth && session?.accessToken) {
    headers.set("Authorization", `Bearer ${session.accessToken}`);
  }

  const response = await fetch(buildUrl(path, options.query), {
    method: options.method ?? "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: options.signal,
  });

  const canRefresh =
    allowRetry &&
    response.status === 401 &&
    !options.skipRefresh &&
    !options.skipAuth &&
    Boolean(session?.refreshToken);

  if (!canRefresh) return response;

  const refreshed = await refreshSession();
  if (!refreshed) {
    clearSession();
    return response;
  }

  return execute(path, options, false);
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const response = await execute(path, options, true);
  const json = (await parseJson(response)) as ApiResponse<T> | null;

  if (!response.ok || (json?.status && json.status >= 400)) {
    throw new ApiError(
      json?.message ?? `Request failed (${response.status})`,
      response.status || json?.status || 500,
      json,
    );
  }

  return json?.data as T;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "An error occurred. Please try again.",
): string {
  if (error instanceof ApiError) return error.message || fallback;
  if (error instanceof Error) return error.message || fallback;
  if (typeof error === "string") return error;
  return fallback;
}
