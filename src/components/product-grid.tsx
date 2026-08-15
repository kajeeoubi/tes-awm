'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, PackageOpen, X, Sparkles } from 'lucide-react';
import { Product } from '@/types/ecommerce';
import { ProductCard } from '@/components/product-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/use-products';

interface ProductGridProps {
  initialProducts: Product[];
}

export function ProductGrid({ initialProducts }: ProductGridProps) {
  const { data: products = initialProducts } = useProducts(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Listen for category selection events dispatched from other sections
  useEffect(() => {
    const handleCategoryEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ category: string }>;
      if (customEvent.detail && customEvent.detail.category) {
        setSelectedCategory(customEvent.detail.category);
      }
    };

    window.addEventListener('sparke:select-category', handleCategoryEvent);
    return () => {
      window.removeEventListener('sparke:select-category', handleCategoryEvent);
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['all', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' || product.category?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Category Pills & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Horizontal Category Nav */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase transition-all ${
                  isSelected
                    ? 'bg-foreground text-background shadow-xs'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {cat === 'all' ? 'Semua Produk' : cat}
              </button>
            );
          })}
        </div>

        {/* Minimalist Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9.5 rounded-full pl-9 pr-8 text-xs bg-background"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
              aria-label="Hapus pencarian"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Menampilkan <strong className="text-foreground">{filteredProducts.length}</strong> dari{' '}
          <strong className="text-foreground">{products.length}</strong> produk
        </span>
        {(searchQuery || selectedCategory !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="text-xs font-semibold text-foreground underline underline-offset-4 hover:text-primary transition-colors"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-border p-8 text-center bg-muted/10">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
            <PackageOpen className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-foreground">Produk Tidak Ditemukan</h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm">
            {products.length === 0
              ? 'Belum ada produk yang tersedia di database.'
              : 'Tidak ada produk yang cocok dengan kata kunci atau filter yang Anda pilih.'}
          </p>
          {products.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4 rounded-full text-xs font-medium"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              Lihat Semua Produk
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
