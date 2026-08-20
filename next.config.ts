import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "coin-images.coingecko.com",
        pathname: "/**",
      },
    ],
  },
  // Was disabled with the note "prevent double rendering". The effects it was
  // hiding — leaked socket subscriptions and un-cancelled fetches — are fixed,
  // so the extra dev-only invocation is now a useful check rather than a
  // source of bugs.
  reactStrictMode: true,
};

export default nextConfig;
