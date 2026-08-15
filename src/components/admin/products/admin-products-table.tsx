'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/ecommerce';
import { useProducts, useDeleteProduct } from '@/hooks/use-products';
import { formatRupiah } from '@/lib/utils';
import { Search, Plus, Edit2, Trash2, Filter, Check, X, MoreHorizontal, Copy } from 'lucide-react';
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
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AdminProductsTableProps {
  products?: Product[];
  onAddProduct?: (productData: Partial<Product>) => void;
  onEditProduct?: (productId: string, productData: Partial<Product>) => void;
  onDeleteProduct?: (productId: string) => void;
  title?: string;
  description?: string;
  showAddButton?: boolean;
}

export function AdminProductsTable({
  products: initialProducts,
  onDeleteProduct,
  title,
  description,
  showAddButton = true,
}: AdminProductsTableProps) {
  const router = useRouter();
  const { data: products = initialProducts || [] } = useProducts(initialProducts);
  const deleteMutation = useDeleteProduct();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    router.push('/admin/products/new');
  };

  const handleOpenEdit = (product: Product) => {
    router.push(`/admin/products/${product.id}`);
  };

  const handleDelete = (productId: string, productName: string) => {
    deleteMutation.mutate(productId);
    if (onDeleteProduct) {
      onDeleteProduct(productId);
    }
  };

  return (
    <Card className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-4">
      {/* Optional Card Title */}
      {title && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-[#1a1a1a]">{title}</h3>
            {description && <p className="text-xs text-neutral-500 font-normal mt-0.5">{description}</p>}
          </div>
        </div>
      )}

      {/* Toolbar Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari produk..."
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

        {/* Right Actions: Category Dropdown & Add Button */}
        <div className="flex items-center gap-2">
          {/* Category Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className={cn(
                    "inline-flex items-center gap-2 h-9.5 px-3.5 rounded-full text-xs font-semibold border transition-all shrink-0 cursor-pointer select-none",
                    categoryFilter !== 'all'
                      ? "border-neutral-900 bg-neutral-900 text-white shadow-xs"
                      : "border-neutral-300/80 bg-white text-neutral-800 hover:bg-neutral-900 hover:text-white hover:border-neutral-900"
                  )}
                />
              }
            >
              <Filter className="h-3.5 w-3.5 shrink-0" />
              <span>{categoryFilter === 'all' ? 'Semua Kategori' : categoryFilter}</span>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={6}
              className="w-44 rounded-xl p-1.5 shadow-lg border border-neutral-200 bg-white z-50"
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-2 py-1">
                Kategori
              </div>
              <DropdownMenuSeparator className="my-1 bg-neutral-100" />
              {categories.map((cat) => {
                const isSelected = categoryFilter === cat;
                return (
                  <DropdownMenuItem
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={cn(
                      "flex items-center justify-between text-xs cursor-pointer rounded-lg px-2 py-2 transition-colors",
                      isSelected
                        ? "bg-neutral-100 font-semibold text-neutral-900"
                        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                    )}
                  >
                    <span>{cat === 'all' ? 'Semua Kategori' : cat}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-neutral-900 shrink-0 ml-2" />}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Add Product Button */}
          {showAddButton && (
            <Button
              onClick={handleOpenAdd}
              className="rounded-full bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold px-4 h-9.5 gap-1.5 shrink-0 shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Produk</span>
            </Button>
          )}

          {categoryFilter !== 'all' && (
            <button
              onClick={() => setCategoryFilter('all')}
              className="text-xs text-neutral-400 hover:text-neutral-700 underline px-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-xl border border-neutral-200/80 overflow-hidden">
        <Table>
          <TableHeader className="bg-neutral-50/70 border-b border-neutral-200/80">
            <TableRow className="hover:bg-transparent">
              <TableHead className="py-3 pl-4 text-[11px] font-bold uppercase tracking-wider text-neutral-400 w-[36%] min-w-[220px]">
                Produk
              </TableHead>
              <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 w-[18%]">
                Kategori
              </TableHead>
              <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 w-[20%]">
                Harga
              </TableHead>
              <TableHead className="py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 w-[16%]">
                Sisa Stok
              </TableHead>
              <TableHead className="py-3 pr-4 text-[11px] font-bold uppercase tracking-wider text-neutral-400 text-right w-[10%]">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow
                  key={product.id}
                  className="border-b border-neutral-100/70 hover:bg-neutral-50/70 transition-colors"
                >
                  {/* Thumbnail & Name */}
                  <TableCell className="pl-4 py-3 sm:py-3.5 max-w-[220px] sm:max-w-[260px]">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-[#f4f4f4] shrink-0 overflow-hidden flex items-center justify-center">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-contain p-1 mix-blend-multiply"
                          />
                        ) : (
                          <span className="text-[10px] text-neutral-400">Foto</span>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-xs font-semibold text-neutral-900 truncate block" title={product.name}>
                          {product.name}
                        </span>
                        {product.description && (
                          <span className="text-[11px] text-neutral-400 truncate block mt-0.5" title={product.description}>
                            {product.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell className="py-3 sm:py-3.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-neutral-100 text-neutral-600 border border-neutral-200/60">
                      {product.category || 'General'}
                    </span>
                  </TableCell>

                  {/* Price */}
                  <TableCell className="py-3 sm:py-3.5 text-xs font-bold text-neutral-900 whitespace-nowrap">
                    {formatRupiah(product.price)}
                  </TableCell>

                  {/* Stock Badge */}
                  <TableCell className="py-3 sm:py-3.5 whitespace-nowrap">
                    {product.stock <= 0 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-red-50 text-red-700 border border-red-200/60">
                        Habis (0)
                      </span>
                    ) : product.stock <= 5 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
                        Sisa {product.stock}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        {product.stock} unit
                      </span>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="pr-4 py-3 sm:py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <button
                            type="button"
                            className="h-7 w-7 inline-flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                            aria-label="Menu aksi produk"
                          />
                        }
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        sideOffset={4}
                        className="w-40 rounded-xl p-1 shadow-lg border border-neutral-200 bg-white z-50"
                      >
                        <DropdownMenuItem
                          onClick={() => handleOpenEdit(product)}
                          className="flex items-center gap-2 text-xs cursor-pointer rounded-lg px-2.5 py-1.5 hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900"
                        >
                          <Edit2 className="h-3.5 w-3.5 text-neutral-500" />
                          <span>Edit Produk</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => {
                            if (typeof navigator !== 'undefined' && navigator.clipboard) {
                              navigator.clipboard.writeText(product.name);
                              toast.success(`Nama produk "${product.name}" disalin!`);
                            }
                          }}
                          className="flex items-center gap-2 text-xs cursor-pointer rounded-lg px-2.5 py-1.5 hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900"
                        >
                          <Copy className="h-3.5 w-3.5 text-neutral-500" />
                          <span>Salin Nama</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="my-1 bg-neutral-100" />

                        <DropdownMenuItem
                          onClick={() => handleDelete(product.id, product.name)}
                          className="flex items-center gap-2 text-xs cursor-pointer rounded-lg px-2.5 py-1.5 hover:bg-red-50 focus:bg-red-50 text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-red-600" />
                          <span>Hapus Produk</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-xs text-neutral-400">
                  Tidak ada produk ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
