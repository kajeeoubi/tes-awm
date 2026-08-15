import { createClient } from '@/lib/supabase/server';
import { Voucher } from '@/types/ecommerce';
import { AdminVouchersTable } from '@/components/admin/vouchers/admin-vouchers-table';

export const dynamic = 'force-dynamic';

export default async function AdminVouchersPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('vouchers')
    .select('*')
    .order('created_at', { ascending: false });

  const vouchers: Voucher[] = (data as Voucher[]) || [];

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1a1a1a]">
              Voucher & Promo
            </h1>
            <span className="inline-block rounded-full border border-neutral-300/80 bg-white/95 px-2.5 py-0.5 text-[9px] font-bold tracking-wider text-neutral-800 uppercase">
              {vouchers.length} Voucher
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 font-normal">
            Kelola kode diskon belanja, potongan harga, dan gratis ongkir untuk pelanggan.
          </p>
        </div>
      </div>

      {/* Vouchers Table */}
      <AdminVouchersTable initialVouchers={vouchers} />
    </div>
  );
}
