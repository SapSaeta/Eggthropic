import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { WebsiteJsonLd } from "@/components/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.eggthropic.com"),
  title: {
    default: "Eggthropic — Laboratorio de Claude",
    template: "%s | Eggthropic",
  },
  description:
    "Laboratorio experimental independiente para aprender Claude construyendo experimentos reales con Claude Code, Agent Skills, MCP y la API de Anthropic. En español.",
  keywords: [
    "Claude",
    "Claude Code",
    "Anthropic",
    "MCP",
    "Model Context Protocol",
    "Agent Skills",
    "experimentos IA",
    "laboratorio IA",
    "herramientas de desarrollo",
  ],
  authors: [{ name: "Eggthropic" }],
  alternates: {
    canonical: "https://www.eggthropic.com",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://www.eggthropic.com",
    siteName: "Eggthropic",
    title: "Eggthropic — Laboratorio de Claude",
    description:
      "Laboratorio experimental independiente: experimentos reales con Claude, documentados con honestidad. En español.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Eggthropic — laboratorio independiente de Claude",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eggthropic — Laboratorio de Claude",
    description:
      "Laboratorio experimental independiente: experimentos reales con Claude, documentados con honestidad. En español.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <WebsiteJsonLd />
        <DisclaimerBanner />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
