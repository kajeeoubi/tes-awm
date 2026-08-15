'use client';

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Voucher } from '@/types/ecommerce';
import { toast } from 'sonner';

export const VOUCHERS_QUERY_KEY = ['vouchers'];

// 1. Hook to Fetch Vouchers with Realtime WebSocket Synchronization
export function useVouchers(includeInactive = false, initialData?: Voucher[]) {
  const queryClient = useQueryClient();
  const supabase = createClient();

  // Realtime WebSocket Subscription
  useEffect(() => {
    const channelId = `realtime_vouchers_${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'vouchers' },
        () => {
          queryClient.invalidateQueries({ queryKey: VOUCHERS_QUERY_KEY });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, queryClient]);

  return useQuery({
    queryKey: [...VOUCHERS_QUERY_KEY, { includeInactive }],
    queryFn: async () => {
      let query = supabase.from('vouchers').select('*').order('created_at', { ascending: false });
      
      if (!includeInactive) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }
      return (data || []).map((v) => ({
        ...v,
        desc: v.description || v.desc,
        minSpend: v.min_spend || v.minSpend,
      })) as Voucher[];
    },
    initialData,
  });
}

// 2. Hook to Create Voucher
export function useCreateVoucher() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (voucherData: Partial<Voucher>) => {
      const { data, error } = await supabase
        .from('vouchers')
        .insert({
          code: voucherData.code?.trim(),
          name: voucherData.name,
          description: voucherData.description || voucherData.desc,
          type: voucherData.type,
          value: voucherData.value,
          min_spend: voucherData.min_spend || voucherData.minSpend || 0,
          is_active: voucherData.is_active ?? true,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Voucher;
    },
    onSuccess: (newVoucher) => {
      queryClient.invalidateQueries({ queryKey: VOUCHERS_QUERY_KEY });
      toast.success(`Voucher "${newVoucher.code}" berhasil ditambahkan`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal menambahkan voucher.');
    },
  });
}

// 3. Hook to Update Voucher
export function useUpdateVoucher() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Voucher> }) => {
      const { data: updated, error } = await supabase
        .from('vouchers')
        .update({
          code: data.code?.trim(),
          name: data.name,
          description: data.description || data.desc,
          type: data.type,
          value: data.value,
          min_spend: data.min_spend || data.minSpend || 0,
          is_active: data.is_active,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updated as Voucher;
    },
    onSuccess: (updatedVoucher) => {
      queryClient.invalidateQueries({ queryKey: VOUCHERS_QUERY_KEY });
      toast.success(`Voucher "${updatedVoucher.code}" berhasil diperbarui`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal memperbarui voucher.');
    },
  });
}

// 4. Hook to Delete Voucher
export function useDeleteVoucher() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('vouchers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VOUCHERS_QUERY_KEY });
      toast.success('Voucher berhasil dihapus');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal menghapus voucher.');
    },
  });
}
