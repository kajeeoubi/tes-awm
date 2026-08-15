'use client';

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Order, OrderStatus } from '@/types/ecommerce';
import { toast } from 'sonner';

export const ORDERS_QUERY_KEY = ['orders'];

// 1. Hook to Fetch All Orders with Realtime WebSocket Synchronization
export function useOrders(initialData?: Order[]) {
  const queryClient = useQueryClient();
  const supabase = createClient();

  // Realtime WebSocket Subscription
  useEffect(() => {
    const channelId = `realtime_orders_${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'order_items' },
        () => {
          queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, queryClient]);

  return useQuery({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      return (data as Order[]) || [];
    },
    initialData,
  });
}

// 2. Hook to Fetch Single Order by ID or Order Number with Realtime Updates
export function useOrderDetail(orderIdOrNumber: string, initialData?: Order) {
  const queryClient = useQueryClient();
  const supabase = createClient();

  // Realtime subscription for single order
  useEffect(() => {
    if (!orderIdOrNumber) return;

    const channelId = `realtime_order_${orderIdOrNumber}_${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['order', orderIdOrNumber] });
          queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderIdOrNumber, supabase, queryClient]);

  return useQuery({
    queryKey: ['order', orderIdOrNumber],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .or(`id.eq.${orderIdOrNumber},order_number.eq.${orderIdOrNumber}`)
        .single();

      if (error) {
        throw error;
      }
      return data as Order;
    },
    initialData,
    enabled: !!orderIdOrNumber,
  });
}

// 3. Hook to Update Order Status (with Instant Invalidation)
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
      toast.success('Status pesanan berhasil diperbarui!');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal memperbarui status pesanan.');
    },
  });
}
