'use client';

import React from 'react';
import { Product } from '@/types/ecommerce';
import { ProductCard } from '@/components/product-card';
import { useProducts } from '@/hooks/use-products';
import { ChevronRight, Flame, PackageOpen } from 'lucide-react';

interface HomeSpecialOffersProps {
  initialProducts: Product[];
}

export function HomeSpecialOffers({ initialProducts }: HomeSpecialOffersProps) {
  const { data: products = initialProducts } = useProducts(initialProducts);

  // Pick special products (or next 4 or products with limited stock)
  const specialOffers = React.useMemo(() => {
    if (products.length <= 4) return products;
    // Prioritize products that have stock <= 10 or alternate slice
    const limited = products.filter((p) => p.stock > 0 && p.stock <= 10);
    if (limited.length >= 4) return limited.slice(0, 4);
    return products.slice(products.length > 4 ? 2 : 0, 6);
  }, [products]);

  return (
    <section id="special-offers" className="scroll-mt-24 container mx-auto px-4 sm:px-8 py-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2.5">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">
            Penawaran Khusus
          </h2>
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-600 border border-rose-100 uppercase tracking-wider">
            <Flame className="h-3 w-3" /> Pilihan Terbatas
          </span>
        </div>
        <a href="#catalog">
          <button className="rounded-full border border-neutral-300 px-4 py-1.5 text-xs font-semibold text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 transition-colors flex items-center gap-1">
            <span>Lihat Semua</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </a>
      </div>

      {specialOffers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50 text-center">
          <PackageOpen className="h-8 w-8 text-neutral-400 mb-2" />
          <p className="text-xs font-semibold text-neutral-700">Belum ada penawaran khusus saat ini</p>
          <p className="text-[11px] text-neutral-400 mt-0.5">Semua produk kami tetap tersedia dengan harga terbaik.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {specialOffers.map((product) => (
            <ProductCard key={product.id} product={product} badgeText="PROMO" />
          ))}
        </div>
      )}
    </section>
  );
}
