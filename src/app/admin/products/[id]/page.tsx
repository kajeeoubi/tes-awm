import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { EditProductView } from '@/components/admin/products/edit-product-view';
import { Product } from '@/types/ecommerce';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (!data) {
    notFound();
  }

  const product = data as Product;

  return <EditProductView product={product} />;
}
