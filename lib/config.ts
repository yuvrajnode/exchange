/**
 * Upstream endpoints. Overridable via env so the app can be pointed at a
 * staging exchange or a mock server without touching code.
 */
export const BACKPACK_API_URL =
  process.env.BACKPACK_API_URL?.replace(/\/$/, "") ??
  "https://api.backpack.exchange";

export const PRICE_INDEXER_API_URL =
  process.env.PRICE_INDEXER_API_URL?.replace(/\/$/, "") ??
  "https://price-indexer.workers.madlads.com";

/** Public because the browser opens the socket directly. */
export const BACKPACK_WS_URL =
  process.env.NEXT_PUBLIC_BACKPACK_WS_URL ?? "wss://ws.backpack.exchange/";

/** Upstream calls hang rather than fail fast, so every proxy bounds them. */
export const UPSTREAM_TIMEOUT_MS = 8000;

/** Coin ids the price indexer is asked about for the markets overview. */
export const TRACKED_COIN_IDS = [
  "solana", "usd-coin", "pyth-network", "jito-governance-token", "tether",
  "bonk", "helium", "helium-mobile", "bitcoin", "ethereum", "dogwifcoin",
  "jupiter-exchange-solana", "parcl", "render-token", "tensor", "wormhole",
  "wen-4", "cat-in-a-dogs-world", "book-of-meme", "raydium", "hivemapper",
  "kamino", "drift-protocol", "nyan", "jeo-boden", "habibi-sol", "io", "zeta",
  "mother-iggy", "sanctum-2", "moo-deng", "debridge", "shuffle-2", "pepe",
  "shiba-inu", "chainlink", "uniswap", "ondo-finance", "holograph", "starknet",
  "matic-network", "mon-protocol", "blur", "worldcoin-wld",
  "polyhedra-network", "unagi-token", "layerzero", "aave", "lido-dao",
  "matr1x", "polygon-ecosystem-token",
].join(",");
