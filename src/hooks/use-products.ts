'use client';

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Product } from '@/types/ecommerce';
import { toast } from 'sonner';

export const PRODUCTS_QUERY_KEY = ['products'];

// 1. Hook to Fetch Products with Realtime WebSocket Synchronization
export function useProducts(initialData?: Product[]) {
  const queryClient = useQueryClient();
  const supabase = createClient();

  // Realtime WebSocket Subscription
  useEffect(() => {
    const channelId = `realtime_products_${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, queryClient]);

  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as Product[]) || [];
    },
    initialData,
  });
}

// 2. Hook to Create Product
export function useCreateProduct() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (productData: Partial<Product>) => {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          stock: productData.stock,
          category: productData.category || 'General',
          image_url: productData.image_url,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Product;
    },
    onSuccess: (newProduct) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      toast.success(`Produk "${newProduct.name}" berhasil ditambahkan`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal menambahkan produk.');
    },
  });
}

// 3. Hook to Update Product
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Product> }) => {
      const { data: updated, error } = await supabase
        .from('products')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updated as Product;
    },
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      toast.success(`Produk "${updatedProduct.name}" berhasil diperbarui`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal memperbarui produk.');
    },
  });
}

// 4. Hook to Delete Product
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      toast.success('Produk berhasil dihapus');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Gagal menghapus produk.');
    },
  });
}
