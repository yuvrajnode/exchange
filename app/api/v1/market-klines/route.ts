import { NextResponse } from "next/server";
import { BACKPACK_API_URL } from "@/lib/config";
import { proxyJson } from "@/lib/upstream";

/** 7-day sparkline series backing the markets table. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startTime = searchParams.get("startTime");
  const endTime = searchParams.get("endTime");
  const interval = searchParams.get("interval") ?? "6h";

  if (!startTime || !endTime) {
    return NextResponse.json(
      { error: "Missing 'startTime' or 'endTime'" },
      { status: 400 }
    );
  }

  const query = new URLSearchParams({ interval, startTime, endTime });
  return proxyJson(`${BACKPACK_API_URL}/wapi/v1/marketDataKlines?${query}`, {
    revalidate: 60,
  });
}
