import { createClient } from '@/lib/supabase/server';
import { Order } from '@/types/ecommerce';
import { AdminOrdersTable } from '@/components/admin/orders/admin-orders-table';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (*)
      )
    `)
    .order('created_at', { ascending: false });

  const orders: Order[] = (data as Order[]) || [];

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1a1a1a]">
              Pesanan Masuk
            </h1>
            <span className="inline-block rounded-full border border-neutral-300/80 bg-white/95 px-2.5 py-0.5 text-[9px] font-bold tracking-wider text-neutral-800 uppercase">
              {orders.length} Transaksi
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 font-normal">
            Kelola dan pantau seluruh transaksi pemesanan dari pembeli secara realtime.
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <AdminOrdersTable orders={orders} />
    </div>
  );
}
