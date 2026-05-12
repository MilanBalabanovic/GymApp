import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/core/components/BottomNav";
import { DBInitializer } from "@/core/components/DBInitializer";
import { InstallBanner } from "@/core/components/InstallBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GymTracker",
  description: "Personal gym tracking app",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GymTracker",
    startupImage: "/icon-512.svg",
  },
  icons: {
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    icon: [{ url: "/icon-512.png", sizes: "512x512", type: "image/png" }],
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0A0A0A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      style={{ background: "#0A0A0A" }}
    >
      <body className="min-h-screen" style={{ background: "var(--background)" }} suppressHydrationWarning>
        <DBInitializer />
        {children}
        <BottomNav />
        <InstallBanner />
      </body>
    </html>
  );
}
