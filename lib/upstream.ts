import { NextResponse } from "next/server";
import { UPSTREAM_TIMEOUT_MS } from "./config";

/**
 * Fetch JSON from an upstream API with a hard timeout, and translate any
 * failure into a JSON error response instead of an unhandled 500 with an
 * opaque body. Route handlers stay three lines long as a result.
 */
export async function proxyJson(
  url: string,
  { revalidate = 0 }: { revalidate?: number } = {}
) {
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      next: { revalidate },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream responded with ${response.status}` },
        { status: response.status === 404 ? 404 : 502 }
      );
    }

    return NextResponse.json(await response.json(), {
      headers: revalidate
        ? { "Cache-Control": `s-maxage=${revalidate}, stale-while-revalidate` }
        : undefined,
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    console.error(`Upstream request failed (${url}):`, error);
    return NextResponse.json(
      { error: timedOut ? "Upstream timed out" : "Upstream request failed" },
      { status: timedOut ? 504 : 502 }
    );
  }
}
