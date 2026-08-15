'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Minus,
  Plus,
  ChevronRight,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowLeft,
  Check,
  CreditCard,
} from 'lucide-react';
import { Product } from '@/types/ecommerce';
import { useCart } from '@/context/cart-context';
import { formatRupiah } from '@/lib/utils';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailView({ product, relatedProducts }: ProductDetailViewProps) {
  const router = useRouter();
  const { addToCart, items, setIsCartOpen } = useCart();
  const [quantity, setQuantity] = useState(1);

  const cartItem = items.find((item) => item.product.id === product.id);
  const currentInCart = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = product.stock <= 0;

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setIsCartOpen(true);
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-neutral-500 overflow-x-auto py-2">
        <Link href="/" className="hover:text-foreground transition-colors shrink-0">
          Beranda
        </Link>
        <ChevronRight className="h-3 w-3 text-neutral-300 shrink-0" />
        <Link href="/#catalog" className="hover:text-foreground transition-colors shrink-0">
          Katalog Produk
        </Link>
        {product.category && (
          <>
            <ChevronRight className="h-3 w-3 text-neutral-300 shrink-0" />
            <Link
              href={`/?category=${encodeURIComponent(product.category)}#catalog`}
              className="hover:text-foreground transition-colors shrink-0 font-medium"
            >
              {product.category}
            </Link>
          </>
        )}
        <ChevronRight className="h-3 w-3 text-neutral-300 shrink-0" />
        <span className="font-semibold text-foreground truncate">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Product Image & Trust Badges */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square sm:aspect-4/3 w-full overflow-hidden rounded-2xl bg-[#f4f4f4] dark:bg-muted/30 p-6 sm:p-10 flex items-center justify-center border border-neutral-100 shadow-xs group">
            {product.image_url ? (
              <div className="relative h-full w-full">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-contain p-2 sm:p-4 mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="text-sm text-neutral-400 font-medium">Foto Produk Tidak Tersedia</div>
            )}

            {/* Category Badge on Top Left */}
            <div className="absolute left-4 top-4 flex items-center gap-2">
              <Link
                href={`/?category=${encodeURIComponent(product.category || 'Aksesori')}#catalog`}
                className="rounded-full bg-white/95 backdrop-blur-xs border border-neutral-200/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-900 shadow-xs hover:bg-neutral-900 hover:text-white transition-colors cursor-pointer"
              >
                {product.category || 'Elektronik'}
              </Link>
            </div>

            <div className="absolute right-4 top-4">
              <span
                className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-xs ${
                  product.stock > 5
                    ? 'bg-emerald-500 text-white'
                    : product.stock > 0
                    ? 'bg-amber-500 text-white'
                    : 'bg-red-500 text-white'
                }`}
              >
                {product.stock > 5 ? 'Stok Tersedia' : product.stock > 0 ? `Sisa ${product.stock} Unit` : 'Stok Habis'}
              </span>
            </div>
          </div>

          {/* Value Proposition Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-neutral-200/80 bg-white shadow-xs">
              <div className="h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-4 w-4 text-neutral-800" />
              </div>
              <div className="min-w-0">
                <h5 className="text-[11px] font-bold text-foreground truncate">Garansi Resmi</h5>
                <p className="text-[10px] text-neutral-400">12 Bulan Garansi Toko</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-neutral-200/80 bg-white shadow-xs">
              <div className="h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                <Truck className="h-4 w-4 text-neutral-800" />
              </div>
              <div className="min-w-0">
                <h5 className="text-[11px] font-bold text-foreground truncate">Pengiriman Cepat</h5>
                <p className="text-[10px] text-neutral-400">Asuransi Paket Penuh</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-neutral-200/80 bg-white shadow-xs">
              <div className="h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 text-neutral-800" />
              </div>
              <div className="min-w-0">
                <h5 className="text-[11px] font-bold text-foreground truncate">100% Original</h5>
                <p className="text-[10px] text-neutral-400">Produk Asli & Segel</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details, Price, and Purchase Actions */}
        <div className="lg:col-span-5 space-y-6 lg:pl-2">
          <div className="space-y-2 border-b border-neutral-200/80 pb-6">
            <Link
              href={`/?category=${encodeURIComponent(product.category || 'Aksesori')}#catalog`}
              className="text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-foreground hover:underline transition-colors inline-block cursor-pointer"
            >
              {product.category || 'Elektronik & Aksesori'}
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-snug">
              {product.name}
            </h1>
            <div className="pt-2 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {formatRupiah(product.price)}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Deskripsi Produk
            </h4>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed whitespace-pre-line font-normal">
              {product.description ||
                'Produk elektronik premium pilihan dengan spesifikasi terkini, performa andal, dan desain minimalis modern untuk melengkapi kebutuhan produktivitas dan hiburan Anda.'}
            </p>
          </div>

          {/* Stock & Cart Status Info */}
          <div className="p-4 rounded-xl bg-neutral-50/80 border border-neutral-200/70 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500 font-medium">Ketersediaan Stok:</span>
              <span className="font-bold text-neutral-900">
                {product.stock > 0 ? `${product.stock} Unit` : 'Stok Kosong'}
              </span>
            </div>
            {currentInCart > 0 && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 pt-1 border-t border-neutral-200/50">
                <Check className="h-3.5 w-3.5" />
                <span>{currentInCart} unit di keranjang belanja Anda</span>
              </div>
            )}
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-neutral-700">Jumlah Pembelian:</span>
              {/* Stepper */}
              <div className="flex items-center rounded-xl border border-neutral-200 bg-neutral-100/80 px-2 py-1">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-foreground hover:bg-white disabled:opacity-30 transition-colors cursor-pointer"
                  aria-label="Kurangi jumlah"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-10 text-center text-xs font-bold text-foreground">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-foreground hover:bg-white disabled:opacity-30 transition-colors cursor-pointer"
                  aria-label="Tambah jumlah"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-2">
              <Button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                variant="outline"
                className="h-11 sm:h-12 flex-1 rounded-full border-neutral-300 text-xs font-bold tracking-wide uppercase hover:bg-neutral-100 gap-2 cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4 shrink-0" />
                <span>{isOutOfStock ? 'Stok Habis' : 'Tambah'}</span>
              </Button>

              <Button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="h-11 sm:h-12 flex-1 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-bold tracking-wide uppercase shadow-xs gap-2 cursor-pointer"
              >
                <CreditCard className="h-4 w-4 shrink-0" />
                <span>{isOutOfStock ? 'Stok Habis' : 'Beli Sekarang'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="border-t border-neutral-200/80 pt-12 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                Rekomendasi Produk Lainnya
              </h3>
              <p className="text-xs text-neutral-500 font-normal">
                Temukan pilihan produk elektronik dan aksesori pelengkap lainnya.
              </p>
            </div>
            <Link
              href="/#catalog"
              className="text-xs font-semibold text-foreground hover:underline flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.slice(0, 4).map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
