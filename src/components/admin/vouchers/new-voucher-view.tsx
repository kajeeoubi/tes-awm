'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Voucher, VoucherType } from '@/types/ecommerce';
import { useCreateVoucher } from '@/hooks/use-vouchers';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tag, Percent, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const VOUCHER_TYPE_LABELS: Record<VoucherType, string> = {
  percent: 'Persentase (%)',
  fixed: 'Nominal Tetap (Rp)',
  shipping: 'Gratis Ongkir (Rp)',
};

export function NewVoucherView() {
  const router = useRouter();
  const createMutation = useCreateVoucher();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<VoucherType>('percent');
  const [value, setValue] = useState(10);
  const [minSpend, setMinSpend] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: Partial<Voucher> = {
        code: code.toUpperCase().trim(),
        name: name.trim(),
        description: description.trim(),
        desc: description.trim(),
        type,
        value: Number(value),
        min_spend: Number(minSpend),
        minSpend: Number(minSpend),
        is_active: isActive,
      };

      await createMutation.mutateAsync(payload);
      router.push('/admin/vouchers');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Gagal membuat voucher promo');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1a1a1a]">
              Tambah Voucher Baru
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 font-normal">
            Buat kode kupon diskon baru untuk kampanye promosi dan potongan harga pesanan.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Info Card */}
        <Card className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-5">
          <h3 className="text-sm font-bold tracking-tight text-[#1a1a1a] flex items-center gap-2">
            <Tag className="h-4 w-4 text-neutral-400" />
            <span>Informasi Kode Promo</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Kode Voucher */}
            <div className="space-y-1.5">
              <Label htmlFor="code" className="text-xs font-semibold">
                Kode Promo <span className="text-destructive">*</span>
              </Label>
              <Input
                id="code"
                placeholder="Masukkan Kode Promo"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                required
                className="h-10 text-xs font-mono font-bold uppercase rounded-xl bg-neutral-50/50"
              />
              <p className="text-[11px] text-neutral-400">
                Gunakan huruf kapital dan tanpa spasi (e.g. FLASH20).
              </p>
            </div>

            {/* Nama Voucher */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold">
                Nama Voucher <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Masukkan Nama Voucher"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-10 text-xs rounded-xl bg-neutral-50/50 font-normal"
              />
              <p className="text-[11px] text-neutral-400">
                Nama yang akan ditampilkan di keranjang belanja pelanggan.
              </p>
            </div>

            {/* Deskripsi */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="description" className="text-xs font-semibold">
                Deskripsi Promo
              </Label>
              <Input
                id="description"
                placeholder="Masukkan Deskripsi Promo"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-10 text-xs rounded-xl bg-neutral-50/50 font-normal"
              />
            </div>
          </div>
        </Card>

        {/* Discount Rules Card */}
        <Card className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-5">
          <h3 className="text-sm font-bold tracking-tight text-[#1a1a1a] flex items-center gap-2">
            <Percent className="h-4 w-4 text-neutral-400" />
            <span>Skema Potongan Harga</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tipe Diskon Dropdown */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Jenis Diskon <span className="text-destructive">*</span>
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      type="button"
                      className="w-full h-10 px-3.5 rounded-xl text-xs bg-neutral-50/50 border border-neutral-200 text-foreground flex items-center justify-between text-left cursor-pointer outline-none hover:bg-neutral-100/60 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 transition-colors font-normal"
                    />
                  }
                >
                  <span className="truncate">{VOUCHER_TYPE_LABELS[type]}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-neutral-400 shrink-0 ml-2" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="start"
                  sideOffset={4}
                  className="w-(--anchor-width) min-w-[200px] rounded-xl p-1.5 shadow-lg border border-neutral-200 bg-white z-50"
                >
                  {(['percent', 'fixed', 'shipping'] as VoucherType[]).map((t) => {
                    const isSelected = type === t;
                    return (
                      <DropdownMenuItem
                        key={t}
                        onClick={() => setType(t)}
                        className={cn(
                          "flex items-center justify-between text-xs cursor-pointer rounded-lg px-2.5 py-2 transition-colors",
                          isSelected
                            ? "bg-neutral-100 font-semibold text-neutral-900"
                            : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                        )}
                      >
                        <span>{VOUCHER_TYPE_LABELS[t]}</span>
                        {isSelected && (
                          <Check className="h-3.5 w-3.5 text-neutral-900 shrink-0" />
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Nilai Diskon */}
            <div className="space-y-1.5">
              <Label htmlFor="value" className="text-xs font-semibold">
                Nilai Diskon ({type === 'percent' ? '%' : 'Rp'}) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="value"
                type="number"
                min={1}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                required
                className="h-10 text-xs rounded-xl bg-neutral-50/50 font-normal"
              />
            </div>

            {/* Min Belanja */}
            <div className="space-y-1.5">
              <Label htmlFor="minSpend" className="text-xs font-semibold">
                Minimal Belanja (Rp)
              </Label>
              <Input
                id="minSpend"
                type="number"
                min={0}
                placeholder="0 (Tanpa syarat belanja)"
                value={minSpend}
                onChange={(e) => setMinSpend(Number(e.target.value))}
                className="h-10 text-xs rounded-xl bg-neutral-50/50 font-normal"
              />
              <p className="text-[11px] text-neutral-400">
                Isi 0 jika voucher bisa dipakai tanpa batasan minimal.
              </p>
            </div>

            {/* Status Aktif Dropdown */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Status Voucher
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      type="button"
                      className="w-full h-10 px-3.5 rounded-xl text-xs bg-neutral-50/50 border border-neutral-200 text-foreground flex items-center justify-between text-left cursor-pointer outline-none hover:bg-neutral-100/60 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 transition-colors font-normal"
                    />
                  }
                >
                  <span className="truncate">{isActive ? 'Aktif' : 'Nonaktif'}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-neutral-400 shrink-0 ml-2" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="start"
                  sideOffset={4}
                  className="w-(--anchor-width) min-w-[160px] rounded-xl p-1.5 shadow-lg border border-neutral-200 bg-white z-50"
                >
                  {[
                    { value: true, label: 'Aktif' },
                    { value: false, label: 'Nonaktif' },
                  ].map((opt) => {
                    const isSelected = isActive === opt.value;
                    return (
                      <DropdownMenuItem
                        key={opt.label}
                        onClick={() => setIsActive(opt.value)}
                        className={cn(
                          "flex items-center justify-between text-xs cursor-pointer rounded-lg px-2.5 py-2 transition-colors",
                          isSelected
                            ? "bg-neutral-100 font-semibold text-neutral-900"
                            : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                        )}
                      >
                        <span>{opt.label}</span>
                        {isSelected && (
                          <Check className="h-3.5 w-3.5 text-neutral-900 shrink-0" />
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>

        {/* Action Bottom Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/vouchers')}
            className="h-10 rounded-full text-xs font-semibold px-5"
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-10 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold px-6 shadow-xs"
          >
            {isSubmitting ? 'Menyimpan...' : 'Terbitkan Voucher'}
          </Button>
        </div>
      </form>
    </div>
  );
}
