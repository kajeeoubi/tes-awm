import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { Product } from '@/types/ecommerce';
import { Navbar } from '@/components/navbar';
import { ProductGrid } from '@/components/product-grid';
import { HomeNewArrivals } from '@/components/home/home-new-arrivals';
import { HomeCategories } from '@/components/home/home-categories';
import { HomeSpecialOffers } from '@/components/home/home-special-offers';
import { CartDrawer } from '@/components/cart-drawer';
import { Footer } from '@/components/footer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products on homepage:', error);
  }

  const productList: Product[] = products || [];

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#222222] font-sans antialiased selection:bg-neutral-800 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* =========================================================================
            SECTION 1: HERO SECTION (50/50 Split Viewport with Seamless Scroll Overlay)
            ========================================================================= */}
        <div className="relative">
          {/* TIER 1 / GRID 1 (Top Hero Grid - Sticky Viewport) */}
          <div className="sticky top-18 z-0 min-h-[calc(100vh-4.5rem)] flex items-stretch bg-white">
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 items-stretch">
              {/* Left Column: Heading & CTA */}
              <div className="flex flex-col justify-center px-6 sm:px-12 lg:pl-16 lg:pr-12 py-12 space-y-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#1a1a1a] leading-[1.12] font-sans">
                  Elektronik Premium <br />
                  Pilihan Para Ahli
                </h1>
                <p className="text-sm text-neutral-500 font-normal">
                  Jelajahi Koleksi Terbaik Kami
                </p>
                <div className="pt-2">
                  <a href="#catalog">
                    <button className="rounded-full border border-neutral-900 bg-white px-8 py-3 text-xs font-semibold text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all">
                      Lihat Semua
                    </button>
                  </a>
                </div>
              </div>

              {/* Right Column: Sage Olive Hero Banner (Flush Right & Top) */}
              <div className="relative min-h-[380px] lg:min-h-full bg-[#9ba58e] overflow-hidden flex flex-col justify-between p-8 sm:p-14 text-white">
                <div className="relative z-10 space-y-2 max-w-xs">
                  <h3 className="text-3xl sm:text-4xl font-normal tracking-tight leading-tight">
                    Generasi Baru Pengalaman Audio
                  </h3>
                </div>

                <div className="relative z-10 pt-6">
                  <a href="#categories">
                    <button className="rounded-full bg-white px-8 py-2.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-100 transition-colors">
                      Jelajahi
                    </button>
                  </a>
                </div>

                {/* Big Circular Speaker Cutout */}
                <div className="absolute -right-16 -top-16 w-80 h-80 sm:w-96 sm:h-96 md:w-[480px] md:h-[480px] rounded-full overflow-hidden pointer-events-none">
                  <Image
                    src="https://images.unsplash.com/photo-1543512214-318c7553f230?w=1000&auto=format&fit=crop&q=80"
                    alt="Speaker Grille"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* TIER 2 / GRID 2 (Bottom Hero Grid - Clean Flat Overlapping Surface) */}
          <div className="relative z-10 min-h-[calc(100vh-4.5rem)] bg-white flex items-stretch">
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 items-stretch">
              {/* Left Column: New Arrivals (4 Products 2x2 Grid, synchronized) */}
              <div id="new-arrivals" className="scroll-mt-24 flex flex-col justify-center px-6 sm:px-12 lg:pl-16 lg:pr-12 pt-6 pb-10 lg:py-8 space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">
                  Produk Terbaru
                </h3>
                <HomeNewArrivals initialProducts={productList} />
              </div>

              {/* Right Column: Dark Charcoal Pro Gear Banner (Flush Right) */}
              <div className="relative min-h-[420px] lg:min-h-full bg-[#272727] overflow-hidden flex flex-col justify-between p-8 sm:p-14 text-white">
                <div className="relative z-10 flex flex-col items-center justify-center flex-1 py-8">
                  <div className="relative h-52 w-52 sm:h-64 sm:w-64 mb-6">
                    <Image
                      src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80"
                      alt="Tech Gadget"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h4 className="text-xl font-normal text-neutral-200 text-center">
                    Perangkat Profesional Nirkabel & Mekanikal
                  </h4>
                </div>

                <div className="relative z-10 text-center pt-2">
                  <a href="#catalog">
                    <button className="rounded-full bg-white px-8 py-3 text-xs font-semibold text-neutral-900 hover:bg-neutral-100 transition-colors">
                      Beli Sekarang
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 2: SHOP BY CATEGORY (Dynamic Synchronized Categories)
            ========================================================================= */}
        <HomeCategories initialProducts={productList} />

        {/* =========================================================================
            SECTION 3: SPECIAL OFFERS (Synchronized 4-Grid)
            ========================================================================= */}
        <HomeSpecialOffers initialProducts={productList} />

        {/* =========================================================================
            SECTION 4 & 5: DUAL PROMO CTA BANNERS (Seamless Sticky Stack Overlay)
            ========================================================================= */}
        <div className="relative">
          {/* CTA BANNER 1 (Sticky Top Layer - Dark Charcoal 50% Off Banner) */}
          <div className="sticky top-18 z-0 min-h-[480px] sm:min-h-[520px] bg-[#242424] text-white flex items-center overflow-hidden py-16">
            <div className="container mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-8 w-full">
              <div className="space-y-4 max-w-md">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight leading-tight">
                  Beli Satu dan <br />
                  Diskon 50% Produk Kedua
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 font-normal">
                  Berlaku untuk semua kategori speaker, perangkat audio, dan aksesori pilihan
                </p>
                <div className="pt-2">
                  <a href="#catalog">
                    <button className="rounded-full bg-white px-8 py-3 text-xs font-semibold text-neutral-900 hover:bg-neutral-100 transition-colors">
                      Beli Sekarang
                    </button>
                  </a>
                </div>
              </div>

              <div className="relative h-64 w-80 md:w-96">
                <Image
                  src="https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&auto=format&fit=crop&q=80"
                  alt="Speaker Banner"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* CTA BANNER 2 (Overlapping Surface on Scroll - Warm Bronze 25% Off Banner) */}
          <div className="relative z-10 min-h-[480px] sm:min-h-[520px] bg-[#3a3528] text-white flex items-center overflow-hidden py-16">
            <div className="container mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-8 w-full">
              <div className="space-y-3 max-w-md">
                <span className="text-[11px] font-bold tracking-widest text-[#d8c39f] uppercase block">
                  DISKON 25%
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight leading-tight">
                  Headphone Terpopuler
                </h2>
                <p className="text-xs sm:text-sm text-neutral-300 font-normal">
                  Kualitas audio superior dengan peredam kebisingan maksimal.
                </p>
                <div className="pt-2">
                  <a href="#catalog">
                    <button className="rounded-full bg-white px-8 py-3 text-xs font-semibold text-neutral-900 hover:bg-neutral-100 transition-colors">
                      Beli Sekarang
                    </button>
                  </a>
                </div>
              </div>

              <div className="relative h-64 w-80 md:w-96">
                <Image
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                  alt="Headphone Banner"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 6: COMPLETE CATALOG & LIVE SEARCH
            ========================================================================= */}
        <section id="catalog" className="scroll-mt-24 container mx-auto px-4 sm:px-8 py-16">
          <div className="mb-8">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Katalog Produk
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mt-0.5">
              Semua Produk Pilihan
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Pilih produk favorit Anda, tentukan jumlah pesanan, dan dapatkan barang impian Anda dengan cepat dan mudah.
            </p>
          </div>

          <ProductGrid initialProducts={productList} />
        </section>
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* =========================================================================
          FOOTER
          ========================================================================= */}
      <Footer />
    </div>
  );
}
