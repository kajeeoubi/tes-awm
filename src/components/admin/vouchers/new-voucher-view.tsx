'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Voucher, VoucherType } from '@/types/ecommerce';
import { useCreateVoucher } from '@/hooks/use-vouchers';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tag, Percent } from 'lucide-react';
import { toast } from 'sonner';

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
      toast.error(err?.message || 'Gagal menambahkan voucher');
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
            Buat kode promo baru untuk meningkatkan konversi transaksi pelanggan.
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
                placeholder="Contoh: HEMAT50, SPARKE10"
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
                placeholder="Contoh: Diskon Pelanggan Baru 10%"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-10 text-xs rounded-xl"
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
                placeholder="Contoh: Bebas ongkos kirim ke seluruh Indonesia tanpa min. belanja"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-10 text-xs rounded-xl"
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
            {/* Tipe Diskon */}
            <div className="space-y-1.5">
              <Label htmlFor="type" className="text-xs font-semibold">
                Jenis Diskon <span className="text-destructive">*</span>
              </Label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as VoucherType)}
                className="w-full h-10 rounded-xl border border-neutral-200 bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900 font-medium"
              >
                <option value="percent">Persentase (%)</option>
                <option value="fixed">Nominal Tetap (Rp)</option>
                <option value="shipping">Gratis Ongkir (Rp)</option>
              </select>
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
                className="h-10 text-xs rounded-xl font-semibold"
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
                placeholder="0 jika tidak ada minimal"
                value={minSpend}
                onChange={(e) => setMinSpend(Number(e.target.value))}
                className="h-10 text-xs rounded-xl"
              />
              <p className="text-[11px] text-neutral-400">
                Isi 0 jika voucher bisa dipakai tanpa batasan minimal transaksi.
              </p>
            </div>

            {/* Status Aktif */}
            <div className="space-y-1.5">
              <Label htmlFor="isActive" className="text-xs font-semibold">
                Status Voucher
              </Label>
              <select
                id="isActive"
                value={isActive ? 'true' : 'false'}
                onChange={(e) => setIsActive(e.target.value === 'true')}
                className="w-full h-10 rounded-xl border border-neutral-200 bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900 font-medium"
              >
                <option value="true">Aktif (Dapat Digunakan Pelanggan)</option>
                <option value="false">Nonaktif (Diarsipkan)</option>
              </select>
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
