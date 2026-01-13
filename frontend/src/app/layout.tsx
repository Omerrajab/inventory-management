import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inventory Management System",
  description: "AI-Driven Inventory and Billing System",
};

import { Sidebar } from "@/components/layout/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <div className="flex">
            <Sidebar />
            <main className="flex-1 min-h-screen bg-background overflow-auto">
              {children}
            </main>
          </div>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
