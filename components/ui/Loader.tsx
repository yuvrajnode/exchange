export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-neutral-800">
        <h1 className="text-2xl font-bold text-white">RETOSWAP</h1>
        <nav className="flex gap-6 text-sm text-gray-300">
          <a href="#">About</a>
          <a href="#">Start</a>
          <a href="#">Feedback</a>
          <a href="#">Download</a>
          <a href="#">FAQ</a>
        </nav>
        <button className="px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-full hover:bg-neutral-800 transition">
          Download Client
        </button>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center py-20 px-4">
        <span className="px-4 py-1 text-xs font-semibold text-purple-400 bg-purple-900 bg-opacity-20 rounded-full mb-4">
          Powered by TOR
        </span>
        <h2 className="text-4xl sm:text-5xl font-bold mb-4">Buy & Sell Monero</h2>
        <p className="text-gray-400 text-sm mb-8">Exchange, Secure, Direct, P2P</p>
        <button className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold rounded-full shadow-lg hover:scale-105 transition">
          Download Client
        </button>
      </section>

      {/* Exchange UI Placeholder */}
      <section className="max-w-6xl mx-auto px-6 mt-12">
        <div className="bg-neutral-900 rounded-xl p-6 shadow-xl border border-neutral-800">
          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-400">
            <button className="px-3 py-1 rounded bg-neutral-800">Market</button>
            <button className="px-3 py-1 rounded">Buy</button>
            <button className="px-3 py-1 rounded">Sell</button>
            <button className="px-3 py-1 rounded">Portfolio</button>
            <button className="px-3 py-1 rounded">Funds</button>
            <button className="px-3 py-1 rounded">Support</button>
            <button className="px-3 py-1 rounded">Account</button>
          </div>

          {/* Dummy chart placeholder */}
          <div className="h-64 bg-gradient-to-br from-black to-gray-900 rounded-lg border border-neutral-800 flex items-center justify-center text-gray-600">
            [ Trading Chart Placeholder ]
          </div>
        </div>
      </section>

    </div>
  );
}
