import { createClient } from '@/lib/supabase/server';
import { Product } from '@/types/ecommerce';
import { AdminProductsTable } from '@/components/admin/products/admin-products-table';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  const products: Product[] = (data as Product[]) || [];

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1a1a1a]">
              Katalog Produk
            </h1>
            <span className="inline-block rounded-full border border-neutral-300/80 bg-white/95 px-2.5 py-0.5 text-[9px] font-bold tracking-wider text-neutral-800 uppercase">
              {products.length} Produk
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 font-normal">
            Kelola inventaris produk, informasi harga, dan sisa stok etalase.
          </p>
        </div>
      </div>

      {/* Products Table */}
      <AdminProductsTable products={products} />
    </div>
  );
}
