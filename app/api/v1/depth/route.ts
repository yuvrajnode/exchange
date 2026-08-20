import { NextResponse } from "next/server";
import { BACKPACK_API_URL } from "@/lib/config";
import { proxyJson } from "@/lib/upstream";

export async function GET(request: Request) {
  const symbol = new URL(request.url).searchParams.get("symbol");

  if (!symbol) {
    return NextResponse.json({ error: "Missing 'symbol'" }, { status: 400 });
  }

  return proxyJson(
    `${BACKPACK_API_URL}/api/v1/depth?symbol=${encodeURIComponent(symbol)}`
  );
}
