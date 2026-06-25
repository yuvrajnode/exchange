import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");
    const limit = searchParams.get("limit") ?? "30";

    const response = await fetch(
      `https://api.backpack.exchange/api/v1/trades?symbol=${symbol}&limit=${limit}`,
      { headers: { Accept: "application/json" } }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
