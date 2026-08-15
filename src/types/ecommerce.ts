export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export type VoucherType = 'shipping' | 'percent' | 'fixed';

export interface Voucher {
  id?: string;
  code: string;
  name: string;
  desc?: string;
  description?: string | null;
  type: VoucherType;
  value: number;
  min_spend?: number;
  minSpend?: number;
  is_active?: boolean;
  created_at?: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  cost: number;
  estimated_days?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_whatsapp: string;
  customer_address?: string;
  total_amount: number;
  subtotal_amount?: number;
  shipping_fee?: number;
  discount_amount?: number;
  voucher_code?: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  subtotal: number;
  created_at: string;
  products?: Product;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  productsSold: number;
  todayOrders: number;
  revenueChange?: number;
  ordersChange?: number;
}

export interface DailySalesData {
  date: string;
  displayDate: string;
  orders: number;
  revenue: number;
}
