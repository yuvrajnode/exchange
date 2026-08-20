import { NextResponse } from "next/server";
import { BACKPACK_API_URL } from "@/lib/config";
import { proxyJson } from "@/lib/upstream";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");
  const interval = searchParams.get("interval");
  const startTime = searchParams.get("startTime");

  if (!symbol || !interval || !startTime) {
    return NextResponse.json(
      { error: "Missing required query parameters" },
      { status: 400 }
    );
  }

  const query = new URLSearchParams({ symbol, interval, startTime });
  return proxyJson(`${BACKPACK_API_URL}/api/v1/klines?${query}`, {
    revalidate: 30,
  });
}
