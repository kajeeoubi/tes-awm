'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '@/types/ecommerce';
import { useProducts } from '@/hooks/use-products';
import { ChevronRight } from 'lucide-react';

interface HomeCategoriesProps {
  initialProducts: Product[];
}

const CATEGORY_IMAGES: Record<string, string> = {
  'Aksesori': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
  'Speaker & Headphone': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  'Monitor & Layar': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
  'Penyimpanan': 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80',
  'Perangkat Pintar': 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
};

const DEFAULT_CATEGORIES = [
  {
    name: 'Aksesori',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Speaker & Headphone',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Monitor & Layar',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
  },
];

export function HomeCategories({ initialProducts }: HomeCategoriesProps) {
  const { data: products = initialProducts } = useProducts(initialProducts);

  const categories = React.useMemo(() => {
    // Get unique categories from products
    const catMap = new Map<string, { count: number; image?: string }>();

    products.forEach((p) => {
      if (p.category) {
        const existing = catMap.get(p.category) || { count: 0 };
        catMap.set(p.category, {
          count: existing.count + 1,
          image: existing.image || p.image_url || undefined,
        });
      }
    });

    if (catMap.size === 0) {
      return DEFAULT_CATEGORIES.slice(0, 3).map((c) => ({
        name: c.name,
        count: 0,
        image: c.image,
      }));
    }

    return Array.from(catMap.entries())
      .map(([name, info]) => {
        // Find suitable image
        const mappedImg = CATEGORY_IMAGES[name] || info.image || DEFAULT_CATEGORIES[0].image;
        return {
          name,
          count: info.count,
          image: mappedImg,
        };
      })
      .slice(0, 3);
  }, [products]);

  const handleCategoryClick = (categoryName: string) => {
    // Dispatch custom event for ProductGrid to pick up
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('sparke:select-category', { detail: { category: categoryName } })
      );
      const catalogEl = document.getElementById('catalog');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="categories" className="scroll-mt-24 bg-[#fafafa] py-16 border-y border-neutral-200/60">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">
              Belanja Berdasarkan Kategori
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Temukan perlengkapan ideal sesuai kebutuhan teknologi Anda
            </p>
          </div>
          <a href="#catalog">
            <button className="rounded-full border border-neutral-300 px-4 py-1.5 text-xs font-semibold text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 transition-colors flex items-center gap-1">
              <span>Lihat Semua</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className="group block space-y-3 cursor-pointer"
            >
              <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-neutral-200 shadow-xs">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {cat.count > 0 && (
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                    {cat.count} Produk
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-900 group-hover:underline underline-offset-2">
                  {cat.name}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
