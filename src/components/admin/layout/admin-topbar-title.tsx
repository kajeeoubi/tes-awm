'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

export function AdminTopbarTitle() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin/orders/')) {
    return (
      <div className="flex items-center gap-1.5 text-sm">
        <Link
          href="/admin/orders"
          className="text-neutral-400 hover:text-[#1a1a1a] font-medium transition-colors"
        >
          Pesanan
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-neutral-300 shrink-0" />
        <span className="font-bold tracking-tight text-[#1a1a1a]">
          Detail Pesanan
        </span>
      </div>
    );
  }

  if (pathname === '/admin/products/new') {
    return (
      <div className="flex items-center gap-1.5 text-sm">
        <Link
          href="/admin/products"
          className="text-neutral-400 hover:text-[#1a1a1a] font-medium transition-colors"
        >
          Katalog Produk
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-neutral-300 shrink-0" />
        <span className="font-bold tracking-tight text-[#1a1a1a]">
          Tambah Produk
        </span>
      </div>
    );
  }

  if (pathname.startsWith('/admin/products/') && pathname !== '/admin/products') {
    return (
      <div className="flex items-center gap-1.5 text-sm">
        <Link
          href="/admin/products"
          className="text-neutral-400 hover:text-[#1a1a1a] font-medium transition-colors"
        >
          Katalog Produk
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-neutral-300 shrink-0" />
        <span className="font-bold tracking-tight text-[#1a1a1a]">
          Ubah Produk
        </span>
      </div>
    );
  }

  if (pathname === '/admin/vouchers/new') {
    return (
      <div className="flex items-center gap-1.5 text-sm">
        <Link
          href="/admin/vouchers"
          className="text-neutral-400 hover:text-[#1a1a1a] font-medium transition-colors"
        >
          Voucher & Promo
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-neutral-300 shrink-0" />
        <span className="font-bold tracking-tight text-[#1a1a1a]">
          Tambah Voucher
        </span>
      </div>
    );
  }

  if (pathname.startsWith('/admin/vouchers/') && pathname !== '/admin/vouchers') {
    return (
      <div className="flex items-center gap-1.5 text-sm">
        <Link
          href="/admin/vouchers"
          className="text-neutral-400 hover:text-[#1a1a1a] font-medium transition-colors"
        >
          Voucher & Promo
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-neutral-300 shrink-0" />
        <span className="font-bold tracking-tight text-[#1a1a1a]">
          Ubah Voucher
        </span>
      </div>
    );
  }

  const getPageTitle = () => {
    if (pathname === '/admin/orders') return 'Pesanan';
    if (pathname === '/admin/products') return 'Katalog Produk';
    if (pathname === '/admin/vouchers') return 'Voucher & Promo';
    if (pathname === '/admin' || pathname === '/admin/') return 'Ringkasan';
    return 'Panel Kontrol';
  };

  return (
    <span className="text-sm font-bold tracking-tight text-[#1a1a1a]">
      {getPageTitle()}
    </span>
  );
}
