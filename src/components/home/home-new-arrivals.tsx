'use client';

import React from 'react';
import { Product } from '@/types/ecommerce';
import { ProductCard } from '@/components/product-card';
import { useProducts } from '@/hooks/use-products';
import { Sparkles, PackageOpen } from 'lucide-react';

interface HomeNewArrivalsProps {
  initialProducts: Product[];
}

export function HomeNewArrivals({ initialProducts }: HomeNewArrivalsProps) {
  const { data: products = initialProducts } = useProducts(initialProducts);
  const newArrivals = products.slice(0, 4);

  if (newArrivals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50 text-center">
        <PackageOpen className="h-8 w-8 text-neutral-400 mb-2" />
        <p className="text-xs font-semibold text-neutral-700">Belum ada produk terbaru</p>
        <p className="text-[11px] text-neutral-400 mt-0.5">Produk yang baru ditambahkan akan muncul di sini.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
      {newArrivals.map((product) => (
        <ProductCard key={product.id} product={product} badgeText="BARU" />
      ))}
    </div>
  );
}
