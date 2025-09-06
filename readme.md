# ⚡ Exchange Platform

A high-performance, real-time trading system built to handle low-latency order execution at scale. The platform combines modular, event-driven architecture with efficient queuing, real-time communication, and scalable infrastructure.

![Screenshot](https://github.com/user-attachments/assets/0c35661f-c6a7-4495-9e8a-9173ca331fd6)

---

## 🚀 Tech Stack

### Frontend
- **Next.js & React** – Dynamic, server-rendered UI
- **Tailwind CSS** – Fast, responsive styling

### Backend
- **Node.js & Express** – High-performance API services
- **PostgreSQL** – Transactional data storage
- **Time Series DB** – For high-frequency trade analytics

### Real-Time Communication
- **WebSockets (Socket.io)** – Live trade and market updates

### Queue & Event System
- **Redis** – Order queuing, Pub/Sub for real-time communication

### Matching Engine
- **Custom-built in Node.js** – Fast order matching with event triggers

### Deployment
- **Railway** – Cloud deployment

---

## 🧠 Architecture & Data Flow

### 1. Order Submission

- **User Input**: Traders place buy/sell orders via the frontend.
- **API Request**: Order data is sent to `POST /api/v1/order`.
- **Redis Queue**: API validates and enqueues orders for processing.

### 2. Order Matching

- **Engine Polling**: A custom-built matching engine polls Redis.
- **Execution**: Orders are matched and trades executed.
- **Event Trigger**: Emits a `trade_created` event via Redis Pub/Sub.

### 3. Real-Time Distribution & Storage

- **WebSockets**: Broadcast updates to connected clients instantly.
- **PostgreSQL**: Stores all trade records reliably.
- **Time Series DB**: Logs price/volume data for analytics and visualization.

---

## ✨ Key Features

- ⚡ **Real-Time Execution** – Millisecond-level trade processing
- 📈 **Live Market Updates** – Instant updates via WebSockets
- 🔁 **Scalable Design** – Horizontally scalable with decoupled services
- 🧮 **Efficient Storage** – Dual-database approach for speed and analytics

---

## 🧩 Challenges & Solutions

### Handling High Throughput
- **Problem**: Concurrent order spikes
- **Solution**: Redis queue decouples order intake from processing

### Ensuring Real-Time Execution
- **Problem**: Trade delay risks
- **Solution**: Optimized matching engine + Redis Pub/Sub + WebSockets

### Efficient Data Persistence
- **Problem**: High-frequency data impacting performance
- **Solution**: PostgreSQL for core trades, Time Series DB for analytics

---

## 📦 Setup Instructions

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/exchange-platform.git
cd exchange-platform

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env

# 4. Start the dev server
npm run dev
