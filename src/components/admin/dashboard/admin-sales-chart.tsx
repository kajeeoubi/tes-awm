'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { DailySalesData } from '@/types/ecommerce';
import { formatRupiah } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface AdminSalesChartProps {
  data: DailySalesData[];
}

export function AdminSalesChart({ data }: AdminSalesChartProps) {
  const [metric, setMetric] = useState<'revenue' | 'orders'>('revenue');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="rounded-xl border border-neutral-200/80 bg-white px-4 py-3 shadow-xs text-xs">
          <p className="font-semibold text-neutral-900 mb-1.5">
            {item.displayDate || item.date}
          </p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-6 text-neutral-500">
              <span>Pendapatan:</span>
              <span className="font-semibold text-neutral-900">
                {formatRupiah(item.revenue)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-6 text-neutral-500">
              <span>Pesanan:</span>
              <span className="font-semibold text-neutral-900">
                {item.orders} pesanan
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-5">
      {/* Header & Metric Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-[#1a1a1a]">
            Aktivitas Penjualan
          </h3>
          <p className="text-xs text-neutral-500 font-normal mt-0.5">
            Tren volume pesanan dan pendapatan harian toko
          </p>
        </div>

        {/* Pill Switcher */}
        <div className="inline-flex items-center rounded-full border border-neutral-200/80 bg-neutral-100/70 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setMetric('revenue')}
            className={`rounded-full px-3.5 py-1 text-xs font-medium transition-all ${
              metric === 'revenue'
                ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Pendapatan
          </button>
          <button
            type="button"
            onClick={() => setMetric('orders')}
            className={`rounded-full px-3.5 py-1 text-xs font-medium transition-all ${
              metric === 'orders'
                ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Jumlah Pesanan
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-[280px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1a1a1a" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#1a1a1a" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="displayDate"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              tickFormatter={(value) =>
                metric === 'revenue'
                  ? value >= 1000000
                    ? `${(value / 1000000).toFixed(1)}jt`
                    : `${value / 1000}rb`
                  : value
              }
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={metric}
              stroke="#1a1a1a"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#chartGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
