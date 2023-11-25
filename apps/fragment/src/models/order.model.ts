import { PaymentStatus } from './common.model';

export interface Order {
  customer_id: string;
  order_id: string;
  order_total_amount: number;
  order_payment_type: OrderPaymentType;
  order_created_date: string;
  order_payment_status: PaymentStatus;
  status: OrderStatus;
}

export interface OrderItems {
  order_id: string;
  product_id: string;
  product_sell_price: number;
  product_quantity: number;
  order_created_date: string;
}

export type OrderPaymentType = 'COD' | 'GCASH';
export type OrderStatus = 'DELIVERED' | 'PENDING' | 'OUT_FOR_DELIVERY';
