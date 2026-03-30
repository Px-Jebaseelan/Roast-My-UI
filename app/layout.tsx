import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
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
  metadataBase: new URL("https://phoenixtrinity.com"),
  title: "Roast My UI | Trinity Engine",
  description: "Upload your UI. Get brutally roasted. Instantly receive the fixed Tailwind code.",
  openGraph: {
    title: "Roast My UI | Trinity Engine",
    description: "Upload your UI. Get brutally roasted. Instantly receive the fixed Tailwind code.",
    url: "https://phoenixtrinity.com/roast-my-ui",
    siteName: "Phoenix Trinity",
    images: [
      {
        url: "/og-image.png",
        width: 1920,
        height: 1080,
        alt: "Roast My UI Terminal Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roast My UI | Trinity Engine",
    description: "Upload your UI. Get brutally roasted. Instantly receive the fixed Tailwind code.",
    images: ["/og-image.png"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
