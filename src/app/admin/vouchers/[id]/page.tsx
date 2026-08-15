import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { EditVoucherView } from '@/components/admin/vouchers/edit-voucher-view';
import { Voucher } from '@/types/ecommerce';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditVoucherPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from('vouchers')
    .select('*')
    .or(`id.eq.${id},code.eq.${id}`)
    .single();

  if (!data) {
    notFound();
  }

  const voucher = data as Voucher;

  return <EditVoucherView voucher={voucher} />;
}
