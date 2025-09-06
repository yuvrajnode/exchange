/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['coin-images.coingecko.com'], // Add external domains for images here
    },
      async rewrites() {
        return [
          {
            source: '/api/tickers',  // When calling this path in your frontend
            destination: 'https://api.backpack.exchange/api/v1/tickers',  // It will proxy the request to this API
          },
        ];
      },
      reactStrictMode: false, // Disable strict mode to prevent double rendering
    };
    
    export default nextConfig;
    