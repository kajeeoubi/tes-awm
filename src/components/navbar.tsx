'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/cart-context';

const NAV_ITEMS = [
  { label: 'Produk Terbaru', href: '#new-arrivals', id: 'new-arrivals' },
  { label: 'Kategori', href: '#categories', id: 'categories' },
  { label: 'Penawaran Khusus', href: '#special-offers', id: 'special-offers' },
  { label: 'Semua Produk', href: '#catalog', id: 'catalog' },
];

export function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const { totalItems, setIsCartOpen } = useCart();
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;

      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const item = NAV_ITEMS[i];
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(item.id);
            return;
          }
        }
      }
      setActiveSection('');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-white/95 backdrop-blur-md dark:bg-background/95 transition-all">
      <div className="container mx-auto flex h-18 items-center justify-between px-4 sm:px-8">
        {/* Brand Logo - Sparke */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-4.5 w-4.5 rounded-[4px] border-2 border-foreground flex items-center justify-center">
            <div className="h-1.5 w-1.5 bg-foreground rounded-[1px]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground font-sans">
            Sparke
          </span>
        </Link>

        {/* Center Nav Links with Scroll Spy Highlight (Desktop) */}
        <nav className="hidden lg:flex items-center gap-8 text-xs tracking-normal">
          {NAV_ITEMS.map((item) => {
            const isActive = isHomePage && activeSection === item.id;
            const targetHref = isHomePage ? item.href : `/${item.href}`;

            return (
              <Link
                key={item.id}
                href={targetHref}
                className={`py-1 transition-colors ${
                  isActive
                    ? 'text-foreground font-bold'
                    : 'text-neutral-500 hover:text-foreground font-medium'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Nav Icons */}
        <div className="flex items-center gap-4 text-xs font-medium text-foreground">
          {/* Cart Icon with Counter */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center p-1.5 hover:opacity-75 transition-opacity"
            aria-label="Buka Keranjang"
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            <span className="ml-1 text-xs font-bold">
              {totalItems}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
