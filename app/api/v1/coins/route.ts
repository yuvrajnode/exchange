import { PRICE_INDEXER_API_URL, TRACKED_COIN_IDS } from "@/lib/config";
import { proxyJson } from "@/lib/upstream";

/**
 * Proxies the price indexer. The browser used to call this third-party origin
 * directly, which meant every failure surfaced as an opaque CORS error and no
 * caching was possible.
 */
export async function GET() {
  return proxyJson(
    `${PRICE_INDEXER_API_URL}/?ids=${encodeURIComponent(TRACKED_COIN_IDS)}`,
    { revalidate: 30 }
  );
}
