import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { OrderDetailView } from '@/components/admin/orders/order-detail-view';
import { Order } from '@/types/ecommerce';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (*)
      )
    `)
    .or(`id.eq.${id},order_number.eq.${id}`)
    .single();

  if (!data) {
    notFound();
  }

  const order = data as Order;

  return <OrderDetailView order={order} />;
}
