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
  metadataBase: new URL("https://eggthropic.com"),
  title: {
    default: "Eggthropic — Claude Lab",
    template: "%s | Eggthropic",
  },
  description:
    "An independent experimental lab for learning Claude by building real experiments with Claude Code, Agent Skills, MCP, and the Anthropic API.",
  keywords: [
    "Claude",
    "Claude Code",
    "Anthropic",
    "MCP",
    "Model Context Protocol",
    "Agent Skills",
    "AI coding",
    "AI experiments",
    "developer tools",
  ],
  authors: [{ name: "Eggthropic" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://eggthropic.com",
    siteName: "Eggthropic",
    title: "Eggthropic — Claude Lab",
    description:
      "An independent experimental lab for learning Claude by building real experiments.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eggthropic — Claude Lab",
    description:
      "An independent experimental lab for learning Claude by building real experiments.",
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
      lang="en"
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
