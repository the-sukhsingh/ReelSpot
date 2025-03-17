import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


export const metadata: Metadata = {
  title: "ReelSpot",
  description: "Share reels...",
};

export const viewport: Viewport = {
  themeColor: "#0A5"}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <Providers>
          <main className="container w-full max-w-7xl mx-auto px-2 py-4 min-h-svh">
        <Navbar />
        {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
