import "./globals.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Providers } from "../components/Providers";
import { Toaster } from "../components/toast";

export const metadata: Metadata = {
  title: "Ripple — Organic Growth Autopilot",
  description:
    "AI marketing operator: understands your business, writes native content, posts to Reddit, and tracks every visitor it sends you.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
