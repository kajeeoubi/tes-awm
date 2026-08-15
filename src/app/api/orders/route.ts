import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateOrderNumber } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer_name,
      customer_whatsapp,
      customer_address,
      voucher_code,
      subtotal_amount,
      shipping_fee,
      discount_amount,
      total_amount,
      items,
    } = body;

    if (!customer_name || !customer_name.trim()) {
      return NextResponse.json(
        { error: 'Nama pemesan wajib diisi.' },
        { status: 400 }
      );
    }

    if (!customer_whatsapp || !customer_whatsapp.trim()) {
      return NextResponse.json(
        { error: 'Nomor WhatsApp wajib diisi.' },
        { status: 400 }
      );
    }

    if (!customer_address || !customer_address.trim()) {
      return NextResponse.json(
        { error: 'Alamat lengkap pengiriman wajib diisi.' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Keranjang belanja tidak boleh kosong.' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const orderNumber = generateOrderNumber();

    // 1. Insert order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: customer_name.trim(),
        customer_whatsapp: customer_whatsapp.trim(),
        customer_address: customer_address.trim(),
        subtotal_amount: Number(subtotal_amount) || 0,
        shipping_fee: Number(shipping_fee) || 0,
        discount_amount: Number(discount_amount) || 0,
        voucher_code: voucher_code ? String(voucher_code).trim().toUpperCase() : null,
        total_amount: Number(total_amount) || 0,
        status: 'pending',
      })
      .select('id, order_number, total_amount, status, created_at')
      .single();

    if (orderError || !orderData) {
      console.error('Error inserting order:', orderError);
      return NextResponse.json(
        { error: orderError?.message || 'Gagal menyimpan data pesanan ke database.' },
        { status: 500 }
      );
    }

    // 2. Insert order items
    const orderItemsToInsert = items.map((item: any) => ({
      order_id: orderData.id,
      product_id: item.product_id || item.product?.id,
      quantity: Number(item.quantity) || 1,
      price: Number(item.price || item.product?.price) || 0,
      subtotal: Number(item.subtotal || (item.price || item.product?.price) * (item.quantity || 1)) || 0,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsToInsert);

    if (itemsError) {
      console.error('Error inserting order items:', itemsError);
    }

    // 3. Decrement product stocks
    for (const item of items) {
      const prodId = item.product_id || item.product?.id;
      const qty = Number(item.quantity) || 1;

      if (prodId) {
        // Fetch current stock
        const { data: prodData } = await supabase
          .from('products')
          .select('stock')
          .eq('id', prodId)
          .single();

        if (prodData) {
          const newStock = Math.max(0, prodData.stock - qty);
          await supabase
            .from('products')
            .update({ stock: newStock })
            .eq('id', prodId);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Pesanan berhasil dibuat!',
      order: orderData,
    });
  } catch (error: any) {
    console.error('Order checkout API error:', error);
    return NextResponse.json(
      { error: error?.message || 'Terjadi kesalahan pada server saat memproses checkout.' },
      { status: 500 }
    );
  }
}
