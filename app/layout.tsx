import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans-body",
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
  title: "Repair Oracle — A diagnostic for broken things",
  description:
    "Photograph a broken object. Get a verdict: repair, salvage, recycle, or replace — with the steps, parts, cost, and the landfill you skip.",
  openGraph: {
    title: "Repair Oracle",
    description: "A diagnostic for broken things.",
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
      className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-bg text-ink">{children}</body>
    </html>
  );
}
