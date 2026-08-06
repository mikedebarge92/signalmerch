import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SignalMerch — SoCal Lead Discovery",
  description: "Find new businesses, acquisitions and events before their next merch order.",
  metadataBase: new URL("https://signalmerch.example"),
  openGraph: {
    title: "SignalMerch — SoCal Lead Discovery",
    description: "Find the moment before the merch order.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SignalMerch — SoCal Lead Discovery",
    description: "Find the moment before the merch order.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
