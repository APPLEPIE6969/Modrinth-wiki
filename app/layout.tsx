import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Modrinth Wiki",
  description: "A fast, beautiful, dynamic wiki for all Modrinth projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} min-h-screen flex flex-col font-sans antialiased text-[var(--color-text-primary)] bg-[var(--color-background-base)]`}>
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
