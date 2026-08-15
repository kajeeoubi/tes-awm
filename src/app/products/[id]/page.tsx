import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Product } from '@/types/ecommerce';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { CartDrawer } from '@/components/cart-drawer';
import { ProductDetailView } from '@/components/products/product-detail-view';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from('products')
    .select('name, description, image_url')
    .eq('id', id)
    .maybeSingle();

  if (!product) {
    return {
      title: 'Produk Tidak Ditemukan — Sparke',
    };
  }

  return {
    title: `${product.name} — Sparke`,
    description: product.description || 'Detail spesifikasi dan harga produk elektronik premium di Sparke.',
    openGraph: {
      title: `${product.name} — Sparke`,
      description: product.description || 'Detail spesifikasi produk elektronik premium.',
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch product detail
  const { data: productData, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !productData) {
    notFound();
  }

  const product = productData as Product;

  // Fetch related products (same category or latest)
  const { data: relatedData } = await supabase
    .from('products')
    .select('*')
    .neq('id', product.id)
    .order('created_at', { ascending: false })
    .limit(8);

  const allRelated: Product[] = relatedData || [];

  // Prioritize same category first
  const sameCategory = allRelated.filter((p) => p.category === product.category);
  const otherCategory = allRelated.filter((p) => p.category !== product.category);
  const relatedProducts = [...sameCategory, ...otherCategory].slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#222222] font-sans antialiased selection:bg-neutral-800 selection:text-white">
      {/* Sticky Topbar Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <ProductDetailView product={product} relatedProducts={relatedProducts} />
      </main>

      {/* Cart Drawer Provider */}
      <CartDrawer />

      {/* Footer */}
      <Footer />
    </div>
  );
}
