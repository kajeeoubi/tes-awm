'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Voucher, VoucherType } from '@/types/ecommerce';
import { useUpdateVoucher, useDeleteVoucher } from '@/hooks/use-vouchers';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Tag, Percent } from 'lucide-react';
import { toast } from 'sonner';

interface EditVoucherViewProps {
  voucher: Voucher;
}

export function EditVoucherView({ voucher }: EditVoucherViewProps) {
  const router = useRouter();
  const updateMutation = useUpdateVoucher();
  const deleteMutation = useDeleteVoucher();

  const [code, setCode] = useState(voucher.code);
  const [name, setName] = useState(voucher.name);
  const [description, setDescription] = useState(voucher.description || voucher.desc || '');
  const [type, setType] = useState<VoucherType>(voucher.type);
  const [value, setValue] = useState(voucher.value);
  const [minSpend, setMinSpend] = useState(voucher.min_spend ?? voucher.minSpend ?? 0);
  const [isActive, setIsActive] = useState(voucher.is_active ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucher.id) return;
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

      await updateMutation.mutateAsync({ id: voucher.id, data: payload });
      router.push('/admin/vouchers');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Gagal menyimpan perubahan voucher');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!voucher.id) return;
    if (confirm(`Yakin ingin menghapus voucher "${voucher.code}"?`)) {
      await deleteMutation.mutateAsync(voucher.id);
      router.push('/admin/vouchers');
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1a1a1a]">
              Ubah Voucher: {voucher.code}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 font-normal">
            Perbarui rincian potongan diskon, minimal belanja, dan status aktif voucher promo.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleDelete}
          className="h-9 rounded-full border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold px-4 gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Hapus Voucher</span>
        </Button>
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
            className="h-10 rounded-full text-xs font-semibold px-5 cursor-pointer"
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-10 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold px-6 shadow-xs cursor-pointer"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </form>
    </div>
  );
}
