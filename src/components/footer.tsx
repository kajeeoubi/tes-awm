'use client';

import React from 'react';
import Link from 'next/link';
import { NewsletterForm } from '@/components/newsletter-form';

export function Footer() {
  return (
    <footer className="bg-[#212121] text-white pt-16 pb-12">
      <div className="container mx-auto px-4 sm:px-8">
        {/* Newsletter Section */}
        <div className="border-b border-neutral-800 pb-12 mb-12">
          <div className="max-w-md space-y-3">
            <h3 className="text-xl font-bold tracking-tight">
              Berlangganan Newsletter Kami
            </h3>
            <p className="text-xs text-neutral-400">
              Jadilah yang pertama mengetahui info diskon eksklusif dan rilis produk terbaru.
            </p>

            <NewsletterForm />
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-xs text-neutral-400">
          {/* Column 1: Brand */}
          <div className="space-y-3 col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-base">
              <div className="h-3.5 w-3.5 rounded-[3px] border border-white flex items-center justify-center">
                <div className="h-1 w-1 bg-white rounded-[1px]" />
              </div>
              <span>Sparke</span>
            </Link>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Elektronik premium dan aksesori teknologi berkualitas tinggi.
            </p>
            <p className="text-[11px] text-white font-semibold pt-1">
              (021) 5000-8888
            </p>
          </div>

          {/* Column 2: Shop */}
          <div className="space-y-2">
            <h5 className="font-semibold text-white uppercase text-[10px] tracking-wider mb-2">Belanja</h5>
            <p><Link href="/#catalog" className="hover:text-white transition-colors">Semua Produk</Link></p>
            <p><Link href="/#special-offers" className="hover:text-white transition-colors">Penawaran Khusus</Link></p>
            <p><Link href="/#new-arrivals" className="hover:text-white transition-colors">Produk Terbaru</Link></p>
            <p><Link href="/#categories" className="hover:text-white transition-colors">Aksesori</Link></p>
            <p><Link href="/#categories" className="hover:text-white transition-colors">Speaker & Headphone</Link></p>
          </div>

          {/* Column 3: Policy */}
          <div className="space-y-2">
            <h5 className="font-semibold text-white uppercase text-[10px] tracking-wider mb-2">Kebijakan</h5>
            <p><span className="hover:text-white transition-colors cursor-pointer">Syarat & Ketentuan</span></p>
            <p><span className="hover:text-white transition-colors cursor-pointer">Kebijakan Privasi</span></p>
            <p><span className="hover:text-white transition-colors cursor-pointer">Informasi Pengiriman</span></p>
            <p><span className="hover:text-white transition-colors cursor-pointer">Kebijakan Garansi</span></p>
          </div>

          {/* Column 4: Follow Us */}
          <div className="space-y-2">
            <h5 className="font-semibold text-white uppercase text-[10px] tracking-wider mb-2">Media Sosial</h5>
            <p><span className="hover:text-white transition-colors cursor-pointer">Instagram</span></p>
            <p><span className="hover:text-white transition-colors cursor-pointer">YouTube</span></p>
            <p><span className="hover:text-white transition-colors cursor-pointer">Facebook</span></p>
          </div>

          {/* Column 5: Address */}
          <div className="space-y-2 text-[11px] col-span-2 sm:col-span-1">
            <h5 className="font-semibold text-white uppercase text-[10px] tracking-wider mb-2">Alamat Toko</h5>
            <p>Sudirman Central Business District</p>
            <p>Jakarta Selatan, Indonesia</p>
            <p className="pt-2">kontak@sparke.id</p>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-2">
          <p>© {new Date().getFullYear()} Sparke Electronics. Hak Cipta Dilindungi.</p>
          <p>Toko Elektronik & Aksesori Terpercaya</p>
        </div>
      </div>
    </footer>
  );
}
