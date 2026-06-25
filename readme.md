# ⚡ Nexus — Real-Time Crypto Exchange

**Live demo →** [exchange-ruby-iota.vercel.app](https://exchange-ruby-iota.vercel.app)

A futuristic, real-time crypto trading front-end built with **Next.js 15** and **React 19**. Nexus streams live market data over WebSockets, renders interactive candlestick charts and a live order book, and ships a polished glassmorphism UI.

![Markets](https://github.com/user-attachments/assets/fad85667-a4e6-41cc-abee-69e1518931e7)
![Trade](https://github.com/user-attachments/assets/fd768972-2642-48a1-b7e0-a698539ec269)

---

## ✨ Features

- ⚡ **Real-time data** — live tickers and order-book depth via a singleton WebSocket manager
- 📈 **Interactive charts** — candlestick + sparkline charts powered by `lightweight-charts`
- 📊 **Live order book** — animated bid/ask depth bars with running totals
- 🎨 **Futuristic UI** — glassmorphism, neon glow, gradient accents and Framer Motion animations
- 📱 **Responsive** — adapts from mobile to ultra-wide trading layouts
- 🔌 **API proxy layer** — Next.js route handlers proxy market data to avoid CORS

---

## 🧱 Tech Stack

| Layer        | Technology                                   |
| ------------ | -------------------------------------------- |
| Framework    | Next.js 15 (App Router), React 19            |
| Language     | TypeScript                                   |
| Styling      | Tailwind CSS v4, custom design tokens        |
| Animation    | Framer Motion, tw-animate-css                |
| Charts       | lightweight-charts                           |
| Data         | Backpack Exchange public API + WebSockets    |
| Deployment   | Vercel · CI via GitHub Actions               |

---

## 🏗️ Architecture

```text
Browser ──► Next.js App Router (pages + API routes)
                │
                ├── /api/v1/tickers ─┐
                ├── /api/v1/depth    ├─► Backpack REST API (proxied)
                ├── /api/v1/klines  ─┘
                │
                └── SignalingManager ─► Backpack WebSocket (live ticker + depth)
```

- **`app/api/v1/*`** — server route handlers proxy REST calls (CORS-safe).
- **`SignalingManager`** — one shared `WebSocket`, message buffering, and per-stream callback registration.
- **`ChartManager` / `CombineData`** — chart lifecycle and merge of price + kline data for the markets table.

---

## 🚀 Getting Started

```bash
# 1. Clone
git clone https://github.com/yuvrajnode/exchange.git
cd exchange

# 2. Install
npm install

# 3. Configure env (optional — defaults to public Backpack endpoints)
cp .env.example .env

# 4. Run
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm run start      # serve production build
npm run lint       # eslint (zero-warning policy)
```

---

## 📁 Project Structure

```text
app/
  api/v1/          REST proxy route handlers
  market/          markets overview page
  trade/[market]/  live trading view
  utils/           SignalingManager, ChartManager, http client, types
components/
  ui/              Appbar, SwapUI, MarketBar, Depth, charts, core buttons
```

---

## 📦 Deployment

Deployed on **Vercel**. Every push to `main` runs the GitHub Actions CI pipeline (`lint` + `build`) and triggers a Vercel deployment.
