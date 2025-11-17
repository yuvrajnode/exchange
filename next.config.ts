/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "coin-images.coingecko.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/tickers", // When calling this path in your frontend
        destination: "https://api.backpack.exchange/api/v1/tickers", // It will proxy the request to this API
      },
    ];
  },
  reactStrictMode: false, // Disable strict mode to prevent double rendering
};

export default nextConfig;