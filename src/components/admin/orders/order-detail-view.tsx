'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Order, OrderStatus } from '@/types/ecommerce';
import { useOrderDetail, useUpdateOrderStatus } from '@/hooks/use-orders';
import { formatRupiah, formatDate, formatRelativeDate } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  User,
  Package,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

interface OrderDetailViewProps {
  order: Order;
}

export function OrderDetailView({ order: initialOrder }: OrderDetailViewProps) {
  const router = useRouter();
  const { data: order = initialOrder } = useOrderDetail(initialOrder.id, initialOrder);
  const updateMutation = useUpdateOrderStatus();
  const status = order.status;

  const handleStatusChange = (newStatus: OrderStatus) => {
    updateMutation.mutate({ orderId: order.id, status: newStatus });
  };

  const getStatusLabel = (s: OrderStatus) => {
    switch (s) {
      case 'completed':
        return 'Selesai';
      case 'processing':
        return 'Diproses';
      case 'cancelled':
        return 'Dibatalkan';
      case 'pending':
      default:
        return 'Menunggu';
    }
  };

  const renderStatusBadge = (s: OrderStatus) => {
    switch (s) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            Selesai
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
            Diproses
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-600 border border-neutral-200/60">
            Dibatalkan
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
            Menunggu
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1a1a1a]">
              {order.order_number}
            </h1>
            {renderStatusBadge(status)}
          </div>
          <div className="flex items-center gap-4 text-xs text-neutral-500 font-normal">
            <span className="flex items-center gap-1.5" title={formatDate(order.created_at)} suppressHydrationWarning>
              <Calendar className="h-3.5 w-3.5 text-neutral-400" />
              {formatRelativeDate(order.created_at)}
            </span>
          </div>
        </div>

        {/* Copy Order Number */}
        <button
          type="button"
          onClick={() => {
            if (typeof navigator !== 'undefined' && navigator.clipboard) {
              navigator.clipboard.writeText(order.order_number);
              toast.success('Nomor pesanan berhasil disalin!');
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 border border-neutral-200/80 rounded-full px-3 py-1.5 bg-white shadow-xs self-start sm:self-auto transition-colors cursor-pointer"
        >
          <Copy className="h-3.5 w-3.5" />
          <span>Salin No. Pesanan</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Ordered Items & Breakdown (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items Card */}
          <Card className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold tracking-tight text-[#1a1a1a] flex items-center gap-2">
                <Package className="h-4 w-4 text-neutral-400" />
                <span>Rincian Produk Dipesan</span>
              </h3>
              <span className="text-xs text-neutral-500">
                {order.order_items?.length || 0} Item
              </span>
            </div>

            {/* List */}
            <div className="divide-y divide-neutral-100">
              {order.order_items && order.order_items.length > 0 ? (
                order.order_items.map((item) => (
                  <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative h-12 w-12 rounded-xl bg-[#f4f4f4] shrink-0 overflow-hidden flex items-center justify-center">
                        {item.products?.image_url ? (
                          <Image
                            src={item.products.image_url}
                            alt={item.products?.name || 'Produk'}
                            fill
                            className="object-contain p-1 mix-blend-multiply"
                          />
                        ) : (
                          <span className="text-[10px] text-neutral-400">Foto</span>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-neutral-900 truncate">
                          {item.products?.name || 'Produk'}
                        </span>
                        <span className="text-[11px] text-neutral-400 mt-0.5">
                          {formatRupiah(item.price)} &times; {item.quantity} unit
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-neutral-900">
                        {formatRupiah(item.subtotal || item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-6 text-xs text-neutral-400 text-center">
                  Tidak ada data rincian item.
                </p>
              )}
            </div>

            {/* Summary calculation */}
            <div className="pt-4 border-t border-neutral-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-neutral-500">
                <span>Subtotal Produk</span>
                <span className="font-semibold text-neutral-900">
                  {formatRupiah(order.subtotal_amount || (order.total_amount + (order.discount_amount || 0) - (order.shipping_fee || 0)))}
                </span>
              </div>

              {(order.discount_amount && order.discount_amount > 0) || order.voucher_code ? (
                <div className="flex items-center justify-between text-emerald-600 font-medium">
                  <span>Diskon Voucher {order.voucher_code ? `(${order.voucher_code})` : ''}</span>
                  <span>-{formatRupiah(order.discount_amount || 0)}</span>
                </div>
              ) : null}

              <div className="flex items-center justify-between text-neutral-500">
                <span>Biaya Pengiriman</span>
                <span className={order.shipping_fee === 0 ? 'font-semibold text-emerald-600' : 'font-semibold text-neutral-900'}>
                  {order.shipping_fee === 0 ? 'Gratis Ongkir' : formatRupiah(order.shipping_fee || 0)}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-sm">
                <span className="font-bold text-neutral-900">Total Pembayaran</span>
                <span className="font-bold text-neutral-900 text-base">
                  {formatRupiah(order.total_amount)}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Customer Info & Actions (1 Col) */}
        <div className="space-y-6">
          {/* Customer Info Card */}
          <Card className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold tracking-tight text-[#1a1a1a] flex items-center gap-2">
              <User className="h-4 w-4 text-neutral-400" />
              <span>Informasi Pelanggan</span>
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">
                  Nama Lengkap
                </span>
                <p className="font-semibold text-neutral-900 text-sm">{order.customer_name}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">
                  No. WhatsApp
                </span>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-neutral-900">
                    {order.customer_whatsapp || '-'}
                  </p>
                  {order.customer_whatsapp && (
                    <a
                      href={`https://wa.me/${order.customer_whatsapp.replace(/\D/g, '').replace(/^0/, '62')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 underline"
                    >
                      <span>Hubungi WA</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-100">
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">
                  Alamat Pengiriman
                </span>
                <p className="font-medium text-neutral-800 leading-relaxed text-xs">
                  {order.customer_address || 'Alamat tidak dicantumkan'}
                </p>
              </div>
            </div>
          </Card>

          {/* Quick Actions Card */}
          <Card className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-semibold tracking-tight text-[#1a1a1a]">
              Aksi Cepat
            </h3>
            <p className="text-xs text-neutral-500 font-normal">
              Perbarui status alur kerja pesanan secara instan.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              {status !== 'processing' && status !== 'completed' && (
                <Button
                  type="button"
                  onClick={() => handleStatusChange('processing')}
                  className="w-full rounded-full bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold h-9"
                >
                  Tandai Sedang Diproses
                </Button>
              )}
              {status !== 'completed' && (
                <Button
                  type="button"
                  onClick={() => handleStatusChange('completed')}
                  className="w-full rounded-full bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold h-9"
                >
                  Tandai Pesanan Selesai
                </Button>
              )}
              {status !== 'cancelled' && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleStatusChange('cancelled')}
                  className="w-full rounded-full border-neutral-300 text-neutral-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-xs font-semibold h-9"
                >
                  Batalkan Pesanan
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
