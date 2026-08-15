'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/ecommerce';
import { useUpdateProduct, useDeleteProduct } from '@/hooks/use-products';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, Image as ImageIcon, DollarSign, Layers, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface EditProductViewProps {
  product: Product;
}

export function EditProductView({ product }: EditProductViewProps) {
  const router = useRouter();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const [name, setName] = useState(product.name || '');
  const [category, setCategory] = useState(product.category || '');
  const [price, setPrice] = useState<number | ''>(product.price ?? '');
  const [stock, setStock] = useState<number | ''>(product.stock ?? '');
  const [imageUrl, setImageUrl] = useState(product.image_url || '');
  const [description, setDescription] = useState(product.description || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Nama produk wajib diisi.');
      return;
    }
    if (price === '' || Number(price) < 0) {
      toast.error('Harga produk tidak valid.');
      return;
    }
    if (stock === '' || Number(stock) < 0) {
      toast.error('Jumlah stok tidak valid.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: Partial<Product> = {
        name: name.trim(),
        category: category.trim() || 'General',
        price: Number(price),
        stock: Number(stock),
        image_url: imageUrl.trim() || null,
        description: description.trim() || null,
      };

      await updateMutation.mutateAsync({ id: product.id, data: payload });
      router.push('/admin/products');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Gagal menyimpan perubahan produk');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Yakin ingin menghapus produk "${product.name}"?`)) {
      await deleteMutation.mutateAsync(product.id);
      router.push('/admin/products');
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1a1a1a]">
              {product.name}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 font-normal">
            Perbarui spesifikasi, harga penjualan, dan persediaan stok etalase.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleDelete}
          className="h-9 rounded-full border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold px-4 gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Hapus Produk</span>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Product Info Card */}
        <Card className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-5">
          <h3 className="text-sm font-bold tracking-tight text-[#1a1a1a] flex items-center gap-2">
            <Package className="h-4 w-4 text-neutral-400" />
            <span>Informasi Produk Utama</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Product Name */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="product_name" className="text-xs font-semibold">
                Nama Produk <span className="text-destructive">*</span>
              </Label>
              <Input
                id="product_name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Mechanical Keyboard RGB Wireless 75%"
                required
                className="h-10 rounded-xl text-xs bg-neutral-50/50"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label htmlFor="category" className="text-xs font-semibold flex items-center gap-1">
                <Layers className="h-3.5 w-3.5 text-neutral-400" />
                <span>Kategori Produk</span>
              </Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Contoh: Peripherals, Audio, Display"
                className="h-10 rounded-xl text-xs"
              />
            </div>

            {/* Image URL */}
            <div className="space-y-1.5">
              <Label htmlFor="imageUrl" className="text-xs font-semibold flex items-center gap-1">
                <ImageIcon className="h-3.5 w-3.5 text-neutral-400" />
                <span>URL Gambar Produk</span>
              </Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="h-10 rounded-xl text-xs"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="description" className="text-xs font-semibold">
                Deskripsi Lengkap Produk
              </Label>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan fitur unggulan, dimensi, konektivitas, dan kelebihan produk..."
                className="w-full text-xs rounded-xl bg-background border border-neutral-200 p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 placeholder:text-neutral-400 transition-all resize-none"
              />
            </div>
          </div>
        </Card>

        {/* Pricing & Inventory Card */}
        <Card className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-5">
          <h3 className="text-sm font-bold tracking-tight text-[#1a1a1a] flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-neutral-400" />
            <span>Harga & Inventaris Stok</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Price */}
            <div className="space-y-1.5">
              <Label htmlFor="price" className="text-xs font-semibold">
                Harga Jual (Rp) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Contoh: 850000"
                required
                className="h-10 rounded-xl text-xs font-semibold"
              />
            </div>

            {/* Stock */}
            <div className="space-y-1.5">
              <Label htmlFor="stock" className="text-xs font-semibold">
                Jumlah Stok (Unit) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="stock"
                type="number"
                min={0}
                value={stock}
                onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Contoh: 25"
                required
                className="h-10 rounded-xl text-xs font-semibold"
              />
            </div>
          </div>
        </Card>

        {/* Actions Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/products')}
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
