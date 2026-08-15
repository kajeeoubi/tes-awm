'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Voucher } from '@/types/ecommerce';
import { useVouchers, useUpdateVoucher, useDeleteVoucher } from '@/hooks/use-vouchers';
import { formatRupiah } from '@/lib/utils';
import { Search, Plus, Edit2, Trash2, X, MoreHorizontal, Percent, DollarSign, Truck, CheckCircle2, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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

interface AdminVouchersTableProps {
  initialVouchers?: Voucher[];
}

export function AdminVouchersTable({ initialVouchers }: AdminVouchersTableProps) {
  const router = useRouter();
  const { data: vouchers = initialVouchers || [] } = useVouchers(true);
  const updateMutation = useUpdateVoucher();
  const deleteMutation = useDeleteVoucher();

  const [search, setSearch] = useState('');

  const filteredVouchers = vouchers.filter((v) => {
    return (
      v.code.toLowerCase().includes(search.toLowerCase()) ||
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      (v.description && v.description.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const handleOpenAdd = () => {
    router.push('/admin/vouchers/new');
  };

  const handleOpenEdit = (v: Voucher) => {
    router.push(`/admin/vouchers/${v.id || v.code}`);
  };

  const handleDelete = (v: Voucher) => {
    if (v.id) {
      deleteMutation.mutate(v.id);
    }
  };

  const handleToggleStatus = (v: Voucher) => {
    if (v.id) {
      updateMutation.mutate({
        id: v.id,
        data: { ...v, is_active: !v.is_active },
      });
    }
  };

  const renderTypeBadge = (type: string) => {
    switch (type) {
      case 'percent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200/60">
            <Percent className="h-3 w-3" />
            <span>Diskon Persen</span>
          </span>
        );
      case 'fixed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <DollarSign className="h-3 w-3" />
            <span>Potongan Harga</span>
          </span>
        );
      case 'shipping':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
            <Truck className="h-3 w-3" />
            <span>Gratis Ongkir</span>
          </span>
        );
    }
  };

  return (
    <Card className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-4">
      {/* Toolbar Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kode promo atau voucher..."
            className="h-9.5 rounded-full pl-9 pr-8 text-xs bg-background"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Add Voucher Button */}
        <Button
          onClick={handleOpenAdd}
          className="h-9.5 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold px-4 shadow-xs self-start sm:self-auto gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Tambah Voucher</span>
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-neutral-200/80 overflow-hidden">
        <Table>
          <TableHeader className="bg-neutral-50/70 border-b border-neutral-200/80">
            <TableRow className="hover:bg-transparent">
              <TableHead className="py-3 pl-4 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Kode Promo
              </TableHead>
              <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Nama Promo & Deskripsi
              </TableHead>
              <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Jenis Keuntungan
              </TableHead>
              <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Min. Belanja
              </TableHead>
              <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 text-center">
                Status
              </TableHead>
              <TableHead className="py-3 pr-4 text-[11px] font-bold uppercase tracking-wider text-neutral-400 text-right">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVouchers.length > 0 ? (
              filteredVouchers.map((v) => (
                <TableRow key={v.code} className="border-b border-neutral-100/70 hover:bg-neutral-50/70 transition-colors">
                  <TableCell className="py-3.5 pl-4 font-bold text-xs font-mono text-neutral-900">
                    <span className="inline-block bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-md">
                      {v.code}
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-neutral-900">{v.name}</span>
                      <span className="text-[11px] text-neutral-400">{v.description || v.desc}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5">
                    {renderTypeBadge(v.type)}
                  </TableCell>
                  <TableCell className="py-3.5 text-xs text-neutral-600">
                    {(v.min_spend || v.minSpend || 0) > 0 ? formatRupiah(v.min_spend || v.minSpend || 0) : 'Tanpa Min.'}
                  </TableCell>
                  <TableCell className="py-3.5 text-center">
                    {v.is_active !== false ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        <span>Aktif</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-500 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-full">
                        <XCircle className="h-3 w-3 text-neutral-400" />
                        <span>Nonaktif</span>
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="pr-4 py-3.5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <button
                            type="button"
                            className="h-7 w-7 inline-flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                          />
                        }
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36 rounded-xl p-1 bg-white border border-neutral-200 shadow-lg">
                        <DropdownMenuItem
                          onClick={() => handleOpenEdit(v)}
                          className="flex items-center gap-2 text-xs cursor-pointer rounded-lg px-2.5 py-1.5 hover:bg-neutral-100 text-neutral-700"
                        >
                          <Edit2 className="h-3.5 w-3.5 text-neutral-500" />
                          <span>Ubah Data</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(v)}
                          className="flex items-center gap-2 text-xs cursor-pointer rounded-lg px-2.5 py-1.5 hover:bg-neutral-100 text-neutral-700"
                        >
                          {v.is_active !== false ? <span>Nonaktifkan</span> : <span>Aktifkan</span>}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-1 bg-neutral-100" />
                        <DropdownMenuItem
                          onClick={() => handleDelete(v)}
                          className="flex items-center gap-2 text-xs text-red-600 cursor-pointer rounded-lg px-2.5 py-1.5 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-red-600" />
                          <span>Hapus</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-xs text-neutral-400">
                  Belum ada data voucher promo yang cocok.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
