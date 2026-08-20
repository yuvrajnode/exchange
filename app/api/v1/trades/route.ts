import { NextResponse } from "next/server";
import { BACKPACK_API_URL } from "@/lib/config";
import { proxyJson } from "@/lib/upstream";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");
  const limit = searchParams.get("limit") ?? "30";

  if (!symbol) {
    return NextResponse.json({ error: "Missing 'symbol'" }, { status: 400 });
  }

  return proxyJson(
    `${BACKPACK_API_URL}/api/v1/trades?symbol=${encodeURIComponent(
      symbol
    )}&limit=${encodeURIComponent(limit)}`
  );
}
