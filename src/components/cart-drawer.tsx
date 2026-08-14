'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ArrowLeft, Loader2, Tag, Check, X, Truck, Sparkles } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { formatRupiah, generateOrderNumber } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { toast } from 'sonner';

interface Voucher {
  code: string;
  name: string;
  desc: string;
  type: 'shipping' | 'percent' | 'fixed';
  value: number;
  minSpend?: number;
}

const AVAILABLE_VOUCHERS: Voucher[] = [
  {
    code: 'GRATISONGKIR',
    name: 'Voucher Gratis Ongkir',
    desc: 'Bebas biaya ongkir s.d Rp 20.000',
    type: 'shipping',
    value: 20000,
  },
  {
    code: 'SPARKE10',
    name: 'Diskon Belanja 10%',
    desc: 'Potongan 10% untuk semua produk',
    type: 'percent',
    value: 10,
  },
  {
    code: 'HEMAT50',
    name: 'Potongan Rp 50.000',
    desc: 'Min. pembelian Rp 200.000',
    type: 'fixed',
    value: 50000,
    minSpend: 200000,
  },
];

const STANDARD_SHIPPING_FEE = 20000;

export function CartDrawer() {
  const { items, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice, isCartOpen, setIsCartOpen } = useCart();
  const router = useRouter();

  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [promoInput, setPromoInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when drawer opens
  useEffect(() => {
    if (isCartOpen) {
      setStep('cart');
    }
  }, [isCartOpen]);

  const isAddressFilled = customerAddress.trim().length >= 5;

  // Calculate discounts & shipping
  let productDiscount = 0;
  let shippingDiscount = 0;
  let rawShippingFee = isAddressFilled ? STANDARD_SHIPPING_FEE : 0;

  if (appliedVoucher) {
    if (appliedVoucher.type === 'shipping') {
      shippingDiscount = isAddressFilled ? Math.min(appliedVoucher.value, rawShippingFee) : 0;
    } else if (appliedVoucher.type === 'percent') {
      productDiscount = Math.round((totalPrice * appliedVoucher.value) / 100);
    } else if (appliedVoucher.type === 'fixed') {
      productDiscount = Math.min(appliedVoucher.value, totalPrice);
    }
  }

  const effectiveShippingFee = Math.max(0, rawShippingFee - shippingDiscount);
  const finalTotal = Math.max(0, totalPrice - productDiscount + effectiveShippingFee);

  const applyVoucherObject = (voucher: Voucher) => {
    if (voucher.minSpend && totalPrice < voucher.minSpend) {
      toast.error(`Minimal belanja untuk voucher ${voucher.code} adalah ${formatRupiah(voucher.minSpend)}`);
      return;
    }

    setAppliedVoucher(voucher);
    setPromoInput('');
    toast.success(`Voucher ${voucher.code} berhasil digunakan! (${voucher.name})`);
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = promoInput.trim().toUpperCase();

    if (!cleanCode) {
      toast.error('Silakan masukkan kode voucher.');
      return;
    }

    const found = AVAILABLE_VOUCHERS.find((v) => v.code === cleanCode);
    if (found) {
      applyVoucherObject(found);
    } else {
      toast.error('Kode voucher tidak ditemukan atau sudah kedaluwarsa.');
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    toast.info('Voucher telah dilepas.');
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error('Keranjang belanja Anda masih kosong.');
      return;
    }

    if (!customerName.trim()) {
      toast.error('Silakan isi nama lengkap Anda.');
      return;
    }

    if (!customerPhone.trim() || customerPhone.length < 8) {
      toast.error('Silakan isi nomor WhatsApp / HP yang valid.');
      return;
    }

    if (!customerAddress.trim()) {
      toast.error('Silakan isi alamat lengkap pengiriman.');
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();
    const orderNumber = generateOrderNumber();

    try {
      // 1. Insert Order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: customerName.trim(),
          customer_phone: `${customerPhone.trim()} (${customerAddress.trim()})`,
          total_amount: finalTotal,
          status: 'pending',
        })
        .select('id, order_number')
        .single();

      if (orderError || !orderData) {
        throw new Error(orderError?.message || 'Gagal memproses pesanan.');
      }

      // 2. Insert Order Items
      const orderItemsToInsert = items.map((item) => ({
        order_id: orderData.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        subtotal: item.product.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);

      if (itemsError) {
        throw new Error(itemsError.message);
      }

      // 3. Decrement Product Stocks
      for (const item of items) {
        const newStock = Math.max(0, item.product.stock - item.quantity);
        await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', item.product.id);
      }

      // Success
      toast.success(`Pesanan #${orderNumber} berhasil dibuat!`);
      clearCart();
      setIsCartOpen(false);
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
      setAppliedVoucher(null);
      setStep('cart');

      // Redirect to Order Success page
      router.push(`/order-success/${orderNumber}`);
    } catch (err: any) {
      console.error('Checkout error:', err);
      toast.error(err.message || 'Terjadi kesalahan saat memproses pesanan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md border-l border-border/80 bg-background">
        {/* Header */}
        <SheetHeader className="border-b border-border/60 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {step === 'checkout' ? (
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 hover:bg-muted text-foreground transition-colors"
                  aria-label="Kembali ke keranjang"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background">
                  <ShoppingBag className="h-4 w-4" />
                </div>
              )}

              <div>
                <SheetTitle className="text-base font-extrabold tracking-tight">
                  {step === 'cart' ? 'Keranjang Belanja' : 'Informasi Pembeli'}
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  {step === 'cart'
                    ? `${totalItems} produk dipilih`
                    : 'Lengkapi alamat dan pilih voucher'}
                </SheetDescription>
              </div>
            </div>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/60 text-muted-foreground mb-4">
              <ShoppingBag className="h-8 w-8 stroke-1" />
            </div>
            <h4 className="text-sm font-bold text-foreground">Keranjang Anda Kosong</h4>
            <p className="mt-1 text-xs text-muted-foreground max-w-xs leading-relaxed">
              Jelajahi koleksi produk kami dan tambahkan barang yang ingin Anda beli.
            </p>
            <Button
              onClick={() => setIsCartOpen(false)}
              variant="outline"
              className="mt-6 rounded-full text-xs font-semibold px-6"
            >
              Mulai Belanja
            </Button>
          </div>
        ) : step === 'cart' ? (
          /* =========================================================================
             STEP 1: CART ITEMS & SUMMARY
             ========================================================================= */
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-border/40">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 py-4 first:pt-0 last:pb-0 items-center">
                  {/* Thumbnail */}
                  <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted/40">
                    {item.product.image_url ? (
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                        Produk
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col min-w-0">
                    <h5 className="truncate text-xs font-bold text-foreground">
                      {item.product.name}
                    </h5>
                    <span className="text-[11px] text-muted-foreground mt-0.5">
                      {formatRupiah(item.product.price)}
                    </span>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center rounded-lg border border-border bg-muted/30 p-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="h-6 w-6 rounded flex items-center justify-center hover:bg-background text-foreground transition-colors"
                          aria-label="Kurangi"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="h-6 w-6 rounded flex items-center justify-center hover:bg-background text-foreground disabled:opacity-40 transition-colors"
                          aria-label="Tambah"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="text-xs font-extrabold text-foreground ml-auto">
                        {formatRupiah(item.product.price * item.quantity)}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        title="Hapus"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Checkout Action */}
            <div className="p-6 bg-muted/20 flex flex-col gap-4 border-t border-border/40">
              {/* Price Breakdown */}
              <div className="rounded-2xl border border-border/60 bg-background p-4 space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Subtotal ({totalItems} barang)</span>
                  <span>{formatRupiah(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Ongkos Kirim</span>
                  <span className="font-semibold text-neutral-400">-</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm font-extrabold text-foreground pt-0.5">
                  <span>Total Sementara</span>
                  <span className="text-base text-foreground font-extrabold">{formatRupiah(totalPrice)}</span>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full h-11 rounded-full text-xs font-bold tracking-wide uppercase shadow-xs gap-2 transition-transform hover:opacity-95 active:scale-98"
              >
                <span>Lanjut ke Pembayaran</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ) : (
          /* =========================================================================
             STEP 2: CHECKOUT FORM (Alamat, Voucher Selector, & Rincian Total Bayar)
             ========================================================================= */
          <div className="flex flex-1 flex-col overflow-hidden">
            <form onSubmit={handleCheckout} className="flex-1 flex flex-col justify-between overflow-y-auto">
              <div className="p-6 space-y-5">
                {/* Form Fields: Kontak & Alamat */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="customer_name" className="text-xs font-semibold">
                      Nama Lengkap <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="customer_name"
                      placeholder="Masukkan nama lengkap"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      autoFocus
                      className="h-10 text-xs rounded-xl bg-background border-border/80"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="customer_phone" className="text-xs font-semibold">
                      Nomor WhatsApp<span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="customer_phone"
                      type="tel"
                      placeholder="Masukan nomor whatsapp aktif"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      className="h-10 text-xs rounded-xl bg-background border-border/80"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="customer_address" className="text-xs font-semibold">
                      Alamat Lengkap Pengiriman <span className="text-destructive">*</span>
                    </Label>
                    <textarea
                      id="customer_address"
                      rows={2}
                      placeholder="Masukkan alamat lengkap"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      required
                      className="w-full text-xs rounded-xl bg-background border border-border/80 p-3 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:border-ring placeholder:text-muted-foreground transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Section Voucher & Kode Promo */}
                <div className="space-y-3 pt-2 border-t border-border/40">
                  <Label htmlFor="promo_code" className="text-xs font-semibold flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5" /> Voucher & Kode Promo
                  </Label>

                  {/* Active Voucher Display */}
                  {appliedVoucher ? (
                    <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-950/20 px-3.5 py-2.5 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white shrink-0">
                          <Check className="h-3 w-3" />
                        </div>
                        <div>
                          <span className="font-bold text-emerald-800 dark:text-emerald-300">
                            {appliedVoucher.code}
                          </span>
                          <p className="text-[10.5px] text-emerald-600 font-medium">
                            {appliedVoucher.name} ({appliedVoucher.desc})
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveVoucher}
                        className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                        title="Hapus Voucher"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Available Vouchers List (Click to Apply) */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground block">
                          Pilihan Voucher Tersedia
                        </span>
                        <div className="flex flex-col gap-2">
                          {AVAILABLE_VOUCHERS.map((v) => (
                            <div
                              key={v.code}
                              className="flex items-center justify-between p-2.5 rounded-xl border border-border/80 bg-background hover:border-neutral-400 transition-all text-xs"
                            >
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-foreground">{v.code}</span>
                                  {v.type === 'shipping' && (
                                    <span className="text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.2 rounded">
                                      Gratis Ongkir
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10.5px] text-muted-foreground">{v.desc}</p>
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => applyVoucherObject(v)}
                                className="h-7 text-[10px] font-bold rounded-lg px-2.5 hover:bg-foreground hover:text-background"
                              >
                                Gunakan
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Manual Input */}
                      <div className="flex gap-2 pt-1">
                        <Input
                          id="promo_code"
                          placeholder="Masukkan kode promo"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          className="h-9 text-xs rounded-xl bg-background border-border/80"
                        />
                        <Button
                          type="button"
                          onClick={handleApplyPromo}
                          variant="secondary"
                          className="h-9 rounded-xl px-4 text-xs font-semibold shrink-0"
                        >
                          Terapkan
                        </Button>
                      </div>
                    </>
                  )}
                </div>

                {/* =========================================================================
                   RINCIAN TOTAL BAYAR (Muncul Setelah Form Alamat & Voucher)
                   ========================================================================= */}
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Rincian Pembayaran
                  </span>
                  
                  {/* Subtotal */}
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Subtotal ({totalItems} barang)</span>
                    <span>{formatRupiah(totalPrice)}</span>
                  </div>

                  {/* Diskon Produk */}
                  {productDiscount > 0 && appliedVoucher && (
                    <div className="flex justify-between text-xs text-emerald-600 font-medium">
                      <span>Diskon ({appliedVoucher.code})</span>
                      <span>-{formatRupiah(productDiscount)}</span>
                    </div>
                  )}

                  {/* Ongkos Kirim */}
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Ongkos Kirim</span>
                    </span>
                    {!isAddressFilled ? (
                      <span className="font-semibold text-neutral-400">-</span>
                    ) : shippingDiscount > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <span className="line-through text-[10.5px] text-muted-foreground">
                          {formatRupiah(STANDARD_SHIPPING_FEE)}
                        </span>
                        <span className="text-emerald-600 font-bold text-xs">
                          Gratis
                        </span>
                      </div>
                    ) : (
                      <span className="font-semibold text-foreground">
                        {formatRupiah(STANDARD_SHIPPING_FEE)}
                      </span>
                    )}
                  </div>

                  <Separator />

                  {/* Total Pembayaran */}
                  <div className="flex justify-between text-sm font-extrabold text-foreground pt-0.5">
                    <span>Total Pembayaran</span>
                    <span className="text-base text-foreground font-extrabold">{formatRupiah(finalTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="p-6 bg-muted/20 border-t border-border/40">
                <Button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="w-full h-11 rounded-full text-xs font-bold tracking-wide uppercase shadow-xs gap-2 transition-transform hover:opacity-95 active:scale-98"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Memproses Pesanan...</span>
                    </>
                  ) : (
                    <>
                      <span>Pesan Sekarang</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
