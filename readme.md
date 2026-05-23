# ⚡ Exchange Platform

DEPLOYED LINK - https://exchange-ruby-iota.vercel.app

A high-performance, real-time trading system built to handle low-latency order execution at scale. The platform combines modular, event-driven architecture with efficient queuing, real-time communication, and scalable infrastructure.

<img width="824" height="410" alt="Screenshot 2025-09-07 at 12 58 00 AM" src="https://github.com/user-attachments/assets/fad85667-a4e6-41cc-abee-69e1518931e7" />
<img width="833" height="479" alt="Screenshot 2025-09-07 at 12 57 48 AM" src="https://github.com/user-attachments/assets/fd768972-2642-48a1-b7e0-a698539ec269" />

## 🚀 Tech Stack

This project leverages a robust and modern tech stack to ensure high performance, scalability, and real-time capabilities:

| Category                  | Technologies                                  | Description                                       |
| :------------------------ | :-------------------------------------------- | :------------------------------------------------ |
| **Frontend**              | Next.js, React, Tailwind CSS                  | Dynamic, server-rendered UI with responsive styling |
| **Backend**               | Node.js, Express, PostgreSQL, Time Series DB  | High-performance API services and data storage    |
| **Real-Time Communication** | WebSockets (Socket.io)                        | Live trade and market updates                     |
| **Queue & Event System**  | Redis                                         | Order queuing, Pub/Sub for real-time communication |
| **Matching Engine**       | Custom-built in Node.js                       | Fast order matching with event triggers           |
| **Deployment**            | Railway                                       | Cloud deployment platform                         |

---

## 🧠 Architecture & Data Flow

The platform's architecture is designed for efficiency and reliability, ensuring seamless order processing and real-time data distribution.

### 1. Order Submission

- **User Input**: Traders place buy/sell orders via the intuitive frontend interface.
- **API Request**: Order data is securely transmitted to the `POST /api/v1/order` endpoint.
- **Redis Queue**: The API validates incoming orders and enqueues them in Redis for asynchronous processing, decoupling the order intake from the matching engine.

### 2. Order Matching

- **Engine Polling**: A custom-built, high-performance matching engine continuously polls the Redis queue for new orders.
- **Execution**: Orders are matched against existing orders in the order book, and trades are executed with millisecond-level precision.
- **Event Trigger**: Upon trade execution, a `trade_created` event is emitted via Redis Pub/Sub, notifying all relevant services and clients.

### 3. Real-Time Distribution & Storage

- **WebSockets**: Real-time updates, including trade confirmations and market data, are broadcast instantly to connected clients via WebSockets, ensuring users have the latest information.
- **PostgreSQL**: All trade records and critical transactional data are stored reliably in PostgreSQL, ensuring data integrity and persistence.
- **Time Series DB**: High-frequency price and volume data are logged in a dedicated Time Series Database for advanced analytics, historical charting, and visualization.

---

## ✨ Key Features

- ⚡ **Real-Time Execution**: Achieve millisecond-level trade processing, crucial for high-frequency trading environments.
- 📈 **Live Market Updates**: Instantaneous market data and trade updates delivered via WebSockets, keeping users informed.
- 🔁 **Scalable Design**: Horizontally scalable architecture with decoupled services, capable of handling increasing loads and traffic.
- 🧮 **Efficient Storage**: A dual-database approach (PostgreSQL for core trades, Time Series DB for analytics) optimizes both transactional integrity and analytical performance.

---

## 🧩 Challenges & Solutions

### Handling High Throughput
- **Problem**: Managing concurrent order spikes and maintaining system responsiveness under heavy load.
- **Solution**: Implementing a Redis queue to decouple order intake from processing, allowing the system to absorb and process orders efficiently without bottlenecks.

### Ensuring Real-Time Execution
- **Problem**: Minimizing trade delays to provide a competitive trading environment.
- **Solution**: Utilizing an optimized matching engine combined with Redis Pub/Sub and WebSockets for rapid event propagation and instant trade execution.

### Efficient Data Persistence
- **Problem**: Storing and retrieving high-frequency trading data without impacting overall system performance.
- **Solution**: Employing PostgreSQL for reliable storage of core trade data and a specialized Time Series Database for efficient logging and analysis of market data.

---

## 📦 Setup Instructions

To get the Exchange Platform running locally, follow these steps:

```bash
# 1. Clone the repository
git clone https://github.com/yuvrajnode/exchange.git
cd exchange

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit the .env file with your database credentials and other configurations

# 4. Start the development server
npm run dev
```

This will start the Next.js development server, and you can access the application in your browser at `http://localhost:3000` (or the port specified in your `.env` file).
