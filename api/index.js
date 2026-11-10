const DEFAULT_API_ORIGIN = "https://api.lorofy.space";

/**
 * Headers that must not be forwarded to the API.
 *
 * The browser sends `Origin: https://lorofy-admin.vercel.app` for POST/PUT
 * requests; Spring Security treats that as a CORS request from an unknown
 * origin and answers with `403 Invalid CORS request`. This function makes the
 * call server-to-server instead, so the header is dropped along with the other
 * proxy-specific values.
 */
const REQUEST_HEADERS_TO_DROP = new Set([
  "accept-encoding",
  "connection",
  "content-length",
  "host",
  "origin",
  "referer",
  "x-forwarded-for",
  "x-forwarded-host",
  "x-forwarded-proto",
  "x-real-ip",
]);

const RESPONSE_HEADERS_TO_KEEP = [
  "cache-control",
  "content-disposition",
  "content-type",
  "etag",
  "expires",
  "last-modified",
  "location",
  "pragma",
  "retry-after",
  "set-cookie",
  "vary",
  "www-authenticate",
];

function apiOrigin() {
  const configured = process.env.LOROFY_API_ORIGIN?.trim();
  return (configured || DEFAULT_API_ORIGIN).replace(/\/+$/, "");
}

function upstreamHeaders(request) {
  const headers = new Headers();

  for (const [key, value] of request.headers) {
    if (!REQUEST_HEADERS_TO_DROP.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  }

  return headers;
}

function downstreamHeaders(upstream) {
  const headers = new Headers();

  for (const key of RESPONSE_HEADERS_TO_KEEP) {
    const value = upstream.headers.get(key);
    if (value !== null) headers.set(key, value);
  }

  // Admin data is private; never let the browser or the CDN store it.
  headers.set("cache-control", "no-store");

  return headers;
}

function jsonError(status, message) {
  return Response.json(
    { status, error: status === 502 ? "Bad Gateway" : "Not Found", message },
    { status, headers: { "cache-control": "no-store" } },
  );
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          allow: "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS",
          "cache-control": "no-store",
        },
      });
    }

    const incoming = new URL(request.url);

    if (!incoming.pathname.startsWith("/api/")) {
      return jsonError(404, "Not found.");
    }

    const target = new URL(incoming.pathname + incoming.search, apiOrigin());
    const init = {
      method: request.method,
      headers: upstreamHeaders(request),
      redirect: "manual",
      signal: request.signal,
    };

    if (request.method !== "GET" && request.method !== "HEAD") {
      init.body = await request.arrayBuffer();
    }

    let upstream;
    try {
      upstream = await fetch(target, init);
    } catch {
      return jsonError(502, "The Lorofy API could not be reached.");
    }

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: downstreamHeaders(upstream),
    });
  },
};
