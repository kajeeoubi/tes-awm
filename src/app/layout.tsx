import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sparke — Toko Elektronik & Aksesori Premium",
  description: "Toko elektronik dan aksesori teknologi terlengkap dengan kurasi produk berkualitas tinggi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={cn("h-full", "antialiased", "scroll-smooth", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-neutral-800 selection:text-white">
        <QueryProvider>
          <CartProvider>
            {children}
            <Toaster position="top-center" closeButton />
          </CartProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
