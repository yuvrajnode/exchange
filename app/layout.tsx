import type { Metadata } from "next";
import {  Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexus — Real-Time Crypto Exchange",
  description:
    "A high-performance, real-time crypto trading platform with live order books, charts and low-latency market data.",
  keywords: ["crypto", "exchange", "trading", "order book", "real-time", "DeFi"],
  authors: [{ name: "Yuvraj Singh" }],
  openGraph: {
    title: "Nexus — Real-Time Crypto Exchange",
    description:
      "Trade crypto with live order books, real-time charts and low-latency market data.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
