import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans-body",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif-display",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-code",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Repair Oracle — Diagnose, repair, and divert from landfill",
  description:
    "Snap a photo of a broken thing. Repair Oracle tells you exactly how to fix it, salvage it, or send it to its most sustainable end — before you throw it away.",
  openGraph: {
    title: "Repair Oracle",
    description:
      "AI-powered repair diagnosis for broken household items. Built for Earth Day.",
    type: "website",
  },
  metadataBase: new URL("https://repair-oracle.local"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bone text-ink">{children}</body>
    </html>
  );
}
