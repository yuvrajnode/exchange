import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nexus — Real-Time Crypto Exchange",
    template: "%s · Nexus",
  },
  description:
    "A high-performance crypto trading terminal with live order books, streaming candlestick charts and low-latency market data.",
  keywords: ["crypto", "exchange", "trading", "order book", "real-time", "DeFi"],
  authors: [{ name: "Yuvraj Singh" }],
  icons: { icon: "/logo.svg" },
  openGraph: {
    title: "Nexus — Real-Time Crypto Exchange",
    description:
      "Trade crypto with live order books, real-time charts and low-latency market data.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0c10",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
