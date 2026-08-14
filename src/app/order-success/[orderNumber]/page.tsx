'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { CheckCircle2, ShoppingBag, ArrowLeft, ArrowRight, Clock, Phone, User, Receipt, ShieldCheck, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Order } from '@/types/ecommerce';
import { formatRupiah, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fire celebratory confetti
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });

    const fetchOrder = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .eq('order_number', orderNumber)
        .single();

      if (!error && data) {
        setOrder(data);
      }
      setLoading(false);
    };

    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <Loader2 className="h-7 w-7 animate-spin text-foreground mb-3" />
        <p className="text-xs text-muted-foreground">Memuat detail pesanan Anda...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
        <div className="rounded-full bg-muted p-4 text-muted-foreground mb-4">
          <Receipt className="h-8 w-8" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Pesanan Tidak Ditemukan</h2>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          Nomor pesanan #{orderNumber} tidak ditemukan di sistem.
        </p>
        <Link href="/" className="mt-6">
          <Button className="rounded-full text-xs font-semibold px-6">Kembali ke Beranda</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 py-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-2xl">
        {/* Top Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-xs mb-2">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Pesanan Berhasil Dibuat!
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Terima kasih telah berbelanja di Sparke. Pesanan Anda telah tersimpan dan sedang kami proses.
          </p>
        </div>

        {/* Invoice Card */}
        <Card className="rounded-3xl border border-border/70 shadow-sm bg-card overflow-hidden">
          <CardHeader className="bg-muted/30 p-6 border-b border-border/60 flex flex-row items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                Nomor Pesanan
              </span>
              <CardTitle className="text-lg sm:text-xl font-mono font-bold text-foreground mt-0.5">
                {order.order_number}
              </CardTitle>
            </div>

            <Badge variant="outline" className="bg-background capitalize px-3 py-1 font-semibold text-xs border-border/80">
              <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
              {order.status === 'pending' ? 'Menunggu Konfirmasi' : order.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
            </Badge>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Customer Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border border-border/60 bg-muted/20 p-4 text-xs">
              <div className="space-y-1">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  <User className="h-3.5 w-3.5" /> Nama Pemesan
                </span>
                <p className="font-bold text-foreground text-sm">{order.customer_name}</p>
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  <Phone className="h-3.5 w-3.5" /> Nomor WhatsApp / HP
                </span>
                <p className="font-bold text-foreground text-sm">{order.customer_phone}</p>
              </div>

              <div className="space-y-1 sm:col-span-2 pt-2 border-t border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  <Clock className="h-3.5 w-3.5" /> Waktu Pemesanan
                </span>
                <p className="font-medium text-foreground">{formatDate(order.created_at)}</p>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                <ShoppingBag className="h-3.5 w-3.5" /> Daftar Produk ({order.order_items?.length || 0})
              </h4>

              <div className="rounded-2xl border border-border/60 overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow>
                      <TableHead className="text-xs">Produk</TableHead>
                      <TableHead className="text-xs text-center">Jumlah</TableHead>
                      <TableHead className="text-xs text-right">Harga</TableHead>
                      <TableHead className="text-xs text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.order_items?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium text-xs">
                          {item.products?.name || 'Produk'}
                        </TableCell>
                        <TableCell className="text-center text-xs">{item.quantity}</TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">
                          {formatRupiah(item.price)}
                        </TableCell>
                        <TableCell className="text-right text-xs font-bold text-foreground">
                          {formatRupiah(item.subtotal)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <Separator />

            {/* Total Section */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Ongkos Kirim</span>
                <span className="text-emerald-600 font-bold uppercase">Gratis</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-foreground pt-2 border-t border-border/60">
                <span>Total Pembayaran</span>
                <span className="text-xl font-extrabold text-foreground">{formatRupiah(order.total_amount)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-2xl bg-muted/40 p-3.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 shrink-0 text-foreground" />
              <span>Pesanan Anda telah tercatat dengan aman oleh sistem.</span>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="mt-8 flex justify-center">
          <Link href="/">
            <Button variant="outline" className="rounded-full gap-2 text-xs font-semibold px-8 h-10 hover:bg-foreground hover:text-background transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Lanjut Belanja</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
