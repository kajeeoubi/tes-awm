'use client';

import { DashboardStats } from '@/types/ecommerce';
import { formatRupiah } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface AdminStatsProps {
  stats: DashboardStats;
}

export function AdminStats({ stats }: AdminStatsProps) {
  const items = [
    {
      label: 'Total Pendapatan',
      value: formatRupiah(stats.totalRevenue),
      trend: 'Akumulasi seluruh pendapatan',
      positive: false,
    },
    {
      label: 'Total Pesanan',
      value: stats.totalOrders.toLocaleString('id-ID'),
      trend: 'Akumulasi seluruh transaksi',
      positive: false,
    },
    {
      label: 'Produk Terjual',
      value: `${stats.productsSold.toLocaleString('id-ID')} unit`,
      trend: 'Akumulasi semua item',
      positive: false,
    },
    {
      label: 'Pesanan Hari Ini',
      value: stats.todayOrders.toLocaleString('id-ID'),
      trend: 'Perlu diproses hari ini',
      positive: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, idx) => (
        <Card
          key={idx}
          className="rounded-2xl border border-neutral-200/80 bg-white p-4.5 sm:p-5 shadow-xs hover:border-neutral-300 transition-all group"
        >
          <div className="flex flex-col space-y-1.5 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 truncate">
              {item.label}
            </span>

            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1a1a1a] transition-colors truncate" title={item.value}>
              {item.value}
            </h3>

            <p className="text-xs text-neutral-500 font-normal pt-0.5 truncate">
              {item.trend}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
