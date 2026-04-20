import type { Metadata } from "next";
import { JetBrains_Mono, Manrope, Sora } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans-body",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-code",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Repair Oracle — Gemini repair intelligence for broken things",
  description:
    "Photograph a broken object. Get a Gemini-grounded verdict: repair, salvage, recycle, or replace — with steps, parts, cost, safety flags, and the landfill you skip.",
  openGraph: {
    title: "Repair Oracle",
    description: "Gemini repair intelligence for lower-waste decisions.",
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
      className={`${manrope.variable} ${sora.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-bg text-ink">{children}</body>
    </html>
  );
}
