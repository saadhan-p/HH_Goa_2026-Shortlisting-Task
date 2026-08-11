import type { Metadata, Viewport } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HH GOA 2026 — BUILDER IDENTITY",
  description: "Upload your photo, input your developer stack, and compile your official Hacker House Goa 2026 Builder Card instantly.",
  keywords: ["Hacker House Goa", "HH Goa 2026", "Builder Pass", "Devfolio", "Builder ID", "FrameInGoa"],
  authors: [{ name: "2:47 PM Studio" }],
  openGraph: {
    title: "HH GOA 2026 — BUILDER IDENTITY",
    description: "Generate your official HH Goa 2026 Builder Card instantly. Fast, client-side, and ready to share.",
    type: "website",
    siteName: "HH Goa Builder Identity",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "HH GOA 2026 — BUILDER IDENTITY",
    description: "Generate your official HH Goa 2026 Builder Card instantly. Fast, client-side, and ready to share.",
    creator: "@247pmstudio",
  },
};

export const viewport: Viewport = {
  themeColor: "#021a10",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceMono.variable} h-full antialiased dark`}>
      <body className="min-h-full bg-hh-dark text-white font-mono flex flex-col selection:bg-hh-yellow selection:text-hh-dark">
        {children}
      </body>
    </html>
  );
}
