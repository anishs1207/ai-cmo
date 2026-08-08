import "./globals.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "../components/toast";

export const metadata: Metadata = {
  title: "Ripple — Organic Growth Autopilot",
  description:
    "AI marketing operator: understands your business, writes native content, posts to Instagram, Facebook and Reddit, and tracks every visitor it sends you.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
