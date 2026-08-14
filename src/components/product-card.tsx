'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { Product } from '@/types/ecommerce';
import { useCart } from '@/context/cart-context';
import { formatRupiah } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  badgeText?: string;
}

export function ProductCard({ product, badgeText }: ProductCardProps) {
  const { addToCart, items } = useCart();
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
    setQuantity(1);
  };

  const displayBadge = badgeText || (product.stock <= 5 && product.stock > 0 ? `Sisa ${product.stock}` : product.stock <= 0 ? 'Habis' : 'BARU');

  return (
    <div className="group flex flex-col justify-between transition-all duration-300">
      {/* Light Grey Image Backdrop */}
      <div className="relative aspect-4/5 w-full overflow-hidden rounded-xl bg-[#f4f4f4] dark:bg-muted/40 p-3 sm:p-4 flex items-center justify-center">
        {product.image_url ? (
          <div className="relative h-full w-full">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-contain p-1.5 sm:p-2 mix-blend-multiply dark:mix-blend-normal transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">Foto Produk</div>
        )}

        {/* Top Left Minimalist Outline Pill Tag */}
        <div className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3">
          <span className="inline-block rounded-full border border-neutral-300/80 bg-white/95 px-2 py-0.5 text-[8.5px] sm:text-[9px] font-bold tracking-wider text-neutral-800 uppercase">
            {displayBadge}
          </span>
        </div>
      </div>

      {/* Product Information */}
      <div className="pt-2.5 pb-1">
        <h4 className="text-xs font-semibold text-foreground line-clamp-1 group-hover:underline underline-offset-2 transition-all">
          {product.name}
        </h4>
        <div className="mt-0.5 flex items-center justify-between text-xs">
          <span className="font-bold text-foreground text-[11px] sm:text-xs">
            {formatRupiah(product.price)}
          </span>
          {currentInCart > 0 && (
            <span className="text-[9px] sm:text-[10px] font-medium text-emerald-600">
              {currentInCart} di keranjang
            </span>
          )}
        </div>
      </div>

      {/* Responsive Controls */}
      <div className="pt-1.5 flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-1 sm:gap-1.5">
          {/* Stepper */}
          <div className="flex items-center rounded-full border border-neutral-200 bg-neutral-100/70 px-1 py-0.5">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={quantity <= 1 || isOutOfStock}
              className="flex h-4.5 w-4.5 sm:h-5 sm:w-5 items-center justify-center rounded-full text-foreground hover:bg-white disabled:opacity-30 transition-colors"
              aria-label="Kurangi jumlah"
            >
              <Minus className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
            </button>
            <span className="w-4 sm:w-5 text-center text-[10px] sm:text-[11px] font-bold text-foreground">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              disabled={quantity >= product.stock || isOutOfStock}
              className="flex h-4.5 w-4.5 sm:h-5 sm:w-5 items-center justify-center rounded-full text-foreground hover:bg-white disabled:opacity-30 transition-colors"
              aria-label="Tambah jumlah"
            >
              <Plus className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
            </button>
          </div>

          {/* Add to Bag Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex-1 h-7 sm:h-7.5 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-40 text-[9px] sm:text-[10px] font-semibold tracking-normal sm:tracking-wide uppercase transition-all flex items-center justify-center gap-1 px-2"
          >
            <ShoppingBag className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
            <span className="truncate">
              {isOutOfStock ? 'Habis' : 'Tambah'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
