import { BACKPACK_API_URL } from "@/lib/config";
import { proxyJson } from "@/lib/upstream";

export async function GET() {
  // Tickers change constantly but a 5s edge cache absorbs the fan-out from
  // several components asking for the same snapshot on page load.
  return proxyJson(`${BACKPACK_API_URL}/api/v1/tickers`, { revalidate: 5 });
}
