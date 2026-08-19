'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Order, OrderStatus } from '@/types/ecommerce';
import { useOrders } from '@/hooks/use-orders';
import { formatRupiah, formatDate, formatRelativeDate, cn } from '@/lib/utils';
import { Search, Eye, X, Filter, Check, MoreHorizontal, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AdminOrdersTableProps {
  orders: Order[];
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void;
  title?: string;
  description?: string;
}

const statusOptions = [
  { id: 'all', label: 'Semua Status' },
  { id: 'pending', label: 'Menunggu', dot: 'bg-amber-500' },
  { id: 'processing', label: 'Diproses', dot: 'bg-blue-500' },
  { id: 'completed', label: 'Selesai', dot: 'bg-emerald-500' },
  { id: 'cancelled', label: 'Dibatalkan', dot: 'bg-neutral-300' },
];

export function AdminOrdersTable({
  orders: initialOrders,
  onStatusChange,
  title,
  description,
}: AdminOrdersTableProps) {
  const router = useRouter();
  const { data: orders = initialOrders } = useOrders(initialOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(search.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      (order.customer_whatsapp || '').includes(search);

    const matchesStatus =
      statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
            Menunggu
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
            Diproses
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            Selesai
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-neutral-100 text-neutral-500 border border-neutral-200/60">
            Dibatalkan
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
            {status}
          </span>
        );
    }
  };

  const handleRowClick = (order: Order) => {
    router.push(`/admin/orders/${order.id}`);
  };

  return (
    <Card className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-4">
      {title && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-[#1a1a1a]">{title}</h3>
            {description && <p className="text-xs text-neutral-500 font-normal mt-0.5">{description}</p>}
          </div>
        </div>
      )}

      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari pesanan..."
            className="h-9.5 rounded-full pl-9 pr-8 text-xs bg-background"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
              aria-label="Hapus pencarian"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className={cn(
                    "inline-flex items-center gap-2 h-9.5 px-3.5 rounded-full text-xs font-semibold border transition-all shrink-0 cursor-pointer select-none",
                    statusFilter !== 'all'
                      ? "border-neutral-900 bg-neutral-900 text-white shadow-xs"
                      : "border-neutral-300/80 bg-white text-neutral-800 hover:bg-neutral-900 hover:text-white hover:border-neutral-900"
                  )}
                />
              }
            >
              <Filter className="h-3.5 w-3.5 shrink-0" />
              <span>
                {statusFilter === 'all'
                  ? 'Filter Status'
                  : statusOptions.find((opt) => opt.id === statusFilter)?.label || 'Filter'}
              </span>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={6}
              className="w-44 rounded-xl p-1.5 shadow-lg border border-neutral-200 bg-white z-50"
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-2 py-1">
                Filter Status
              </div>
              <DropdownMenuSeparator className="my-1 bg-neutral-100" />
              {statusOptions.map((opt) => {
                const isSelected = statusFilter === opt.id;
                return (
                  <DropdownMenuItem
                    key={opt.id}
                    onClick={() => setStatusFilter(opt.id)}
                    className={cn(
                      "flex items-center justify-between text-xs cursor-pointer rounded-lg px-2 py-2 transition-colors",
                      isSelected
                        ? "bg-neutral-100 font-semibold text-neutral-900"
                        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {opt.dot ? (
                        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", opt.dot)} />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-neutral-300 shrink-0" />
                      )}
                      <span>{opt.label}</span>
                    </div>
                    {isSelected && <Check className="h-3.5 w-3.5 text-neutral-900 shrink-0 ml-2" />}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {statusFilter !== 'all' && (
            <button
              onClick={() => setStatusFilter('all')}
              className="text-xs text-neutral-400 hover:text-neutral-700 underline px-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl border border-neutral-200/80 overflow-hidden">
        <Table>
          <TableHeader className="bg-neutral-50/70 border-b border-neutral-200/80">
            <TableRow className="hover:bg-transparent">
              <TableHead className="py-3 pl-4 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                No. Pesanan
              </TableHead>
              <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Customer
              </TableHead>
              <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Total Belanja
              </TableHead>
              <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Status
              </TableHead>
              <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Waktu
              </TableHead>
              <TableHead className="py-3 pr-4 text-[11px] font-bold uppercase tracking-wider text-neutral-400 text-right">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow
                  key={order.id}
                  onClick={() => handleRowClick(order)}
                  className="border-b border-neutral-100/70 hover:bg-neutral-50/70 transition-colors cursor-pointer group"
                >
                  <TableCell className="pl-4 py-3.5 font-semibold text-xs text-neutral-900">
                    {order.order_number}
                  </TableCell>
                  <TableCell className="py-3.5">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-neutral-900">
                        {order.customer_name}
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        {order.customer_whatsapp || '-'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5 text-xs font-bold text-neutral-900">
                    {formatRupiah(order.total_amount)}
                  </TableCell>
                  <TableCell className="py-3.5">
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell className="py-3.5 text-xs text-neutral-500 whitespace-nowrap" suppressHydrationWarning title={formatDate(order.created_at)}>
                    {formatRelativeDate(order.created_at)}
                  </TableCell>
                  <TableCell className="pr-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <button
                            type="button"
                            className="h-7 w-7 inline-flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                            aria-label="Menu aksi pesanan"
                          />
                        }
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        sideOffset={4}
                        className="w-44 rounded-xl p-1 shadow-lg border border-neutral-200 bg-white z-50"
                      >
                        <DropdownMenuItem
                          onClick={() => handleRowClick(order)}
                          className="flex items-center gap-2 text-xs cursor-pointer rounded-lg px-2.5 py-1.5 hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900"
                        >
                          <Eye className="h-3.5 w-3.5 text-neutral-500" />
                          <span>Lihat Rincian</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => {
                            if (typeof navigator !== 'undefined' && navigator.clipboard) {
                              navigator.clipboard.writeText(order.order_number);
                              toast.success(`Nomor pesanan ${order.order_number} disalin!`);
                            }
                          }}
                          className="flex items-center gap-2 text-xs cursor-pointer rounded-lg px-2.5 py-1.5 hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900"
                        >
                          <Copy className="h-3.5 w-3.5 text-neutral-500" />
                          <span>Salin No. Pesanan</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-xs text-neutral-400">
                  Tidak ada transaksi yang cocok.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
