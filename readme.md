# Nexus — Real-Time Crypto Exchange

**Live demo →** [exchange-ruby-iota.vercel.app](https://exchange-ruby-iota.vercel.app)

A crypto trading terminal built with **Next.js 15** and **React 19**. Nexus
streams live market data over a single multiplexed WebSocket, renders
candlestick charts and a real order book, and proxies every upstream call
through its own route handlers.

> Front-end only. There is no wallet and no matching engine behind it —
> balances in the order form are simulated and no order is ever sent anywhere.

---

## Features

- **One socket, every stream.** A singleton `SignalingManager` multiplexes
  ticker and depth subscriptions across every mounted panel, with message
  buffering before the socket opens and per-panel callback registration.
- **A real order book.** Seeded from a REST snapshot, then patched by
  incremental depth messages — inserting new levels, removing cleared ones,
  and re-seeding every 20s so it can't drift. Crossed states are resolved
  rather than displayed.
- **Trading terminal.** Candlestick chart with selectable intervals, order
  book, trade tape and an order form, plus an in-place market switcher.
  Clicking a level in the book fills the order form's price.
- **Markets screen.** Sortable, searchable and paginated, with favorites in
  `localStorage` and an SVG sparkline per row.
- **Bounded upstreams.** Every external call goes through `/api/v1/*` with a
  hard timeout and short-lived caching.

---

## Tech stack

| Layer      | Technology                                    |
| ---------- | --------------------------------------------- |
| Framework  | Next.js 15 (App Router), React 19             |
| Language   | TypeScript                                    |
| Styling    | Tailwind CSS v4 with custom design tokens     |
| Charts     | lightweight-charts (candles), inline SVG (sparklines) |
| Data       | Backpack Exchange public API + WebSockets     |
| Deployment | Vercel · CI via GitHub Actions                |

---

## Architecture

```text
Browser ──► Next.js App Router
              │
              ├── /api/v1/tickers       ─┐
              ├── /api/v1/depth          │
              ├── /api/v1/klines         ├─► Backpack REST  (proxied)
              ├── /api/v1/trades         │
              ├── /api/v1/market-klines ─┘
              ├── /api/v1/coins         ───► Price indexer  (proxied)
              │
              └── SignalingManager      ───► Backpack WebSocket
```

Nothing in the browser talks to a third-party origin directly. `lib/upstream.ts`
gives every route handler the same timeout, caching and error mapping, so a slow
or failing upstream surfaces as a `502`/`504` the UI can render a state for
rather than a hung request.

### Key modules

| Path                        | Responsibility                                        |
| --------------------------- | ----------------------------------------------------- |
| `app/utils/SignalingManager`| Shared WebSocket, buffering, subscription callbacks    |
| `app/utils/useOrderBook`    | Snapshot + incremental depth merge, cross resolution   |
| `app/utils/useTicker`       | Ticker snapshot patched by the live stream             |
| `app/utils/usePolling`      | Interval polling with exponential backoff on failure   |
| `app/utils/ChartManager`    | lightweight-charts lifecycle                           |
| `lib/upstream.ts`           | Timeout-bounded JSON proxy for route handlers          |
| `lib/format.ts`             | Shared price / percent / compact number formatting     |

---

## Getting started

```bash
git clone https://github.com/yuvrajnode/exchange.git
cd exchange
npm install
npm run dev        # http://localhost:3000
```

Configuration is optional — the defaults point at Backpack's public endpoints.
To override them, copy `.env.example` to `.env`:

| Variable                      | Default                                     |
| ----------------------------- | ------------------------------------------- |
| `BACKPACK_API_URL`            | `https://api.backpack.exchange`             |
| `PRICE_INDEXER_API_URL`       | `https://price-indexer.workers.madlads.com` |
| `NEXT_PUBLIC_BACKPACK_WS_URL` | `wss://ws.backpack.exchange/`               |

Other scripts:

```bash
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint, zero-warning policy
```

---

## Project structure

```text
app/
  api/v1/           REST proxy route handlers
  market/           markets overview
  trade/[market]/   trading terminal
  utils/            socket manager, data hooks, http client, types
components/
  landing/          marketing page sections
  markets/          summary, highlights, markets table
  trade/            chart, order book, order form, trade tape, market picker
  ui/primitives/    Button, Panel, Change, CoinIcon, Sparkline, Logo
lib/                config, upstream proxy, formatting, cn()
```

---

## Design

The UI is a flat, dense terminal rather than a decorated marketing surface.
`app/globals.css` defines a neutral surface ramp and exactly three saturated
colours — one brand blue plus semantic up/down — so a green or red cell always
carries meaning. Every comparable figure is set in tabular-figure monospace so
digits don't shift as prices tick.

---

## Deployment

Deployed on **Vercel**. Every push to `main` runs the GitHub Actions CI pipeline
(`lint` + `build`) and triggers a deployment.
