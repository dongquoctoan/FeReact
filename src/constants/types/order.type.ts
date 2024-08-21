import { CommonGetAllParams } from "constants/types/common.type";
import { Product } from "constants/types/product.type";

export type GetOrderParams = CommonGetAllParams & {
  status?: string;
};

export type OrderStatusType =
  | "WAITING_CONFIRM"
  | "WAITING_SHIPPING"
  | "SHIPPING"
  | "DELIVERIED"
  | "CANCELED"
  | "RETURN";

export type DeliveryAddress = {
  _id: string;
  name: string;
  phone: string;
  address_line: string;
  city: {
    _id: string;
    name: string;
  };
  district: {
    _id: string;
    name: string;
  };
  ward: {
    _id: string;
    name: string;
  };
};

export type CheckoutPriceData = {
  merchandise_subtotal: number;
  total_payable: number;
  shipping_subtotal: number;
  price_discount: number;
};

export type Order = {
  _id: string;
  unique_id: string;
  user_id: string;
  status: OrderStatusType;
  checkout_price_data: CheckoutPriceData;
  delivery_address: DeliveryAddress;
  created_at: string;
};

export type ProductItem = {
  id: string;
  name: string;
  sku: string;
  price: number;
  product_id: string;
  product: Product;
  quantity: number;
};

export type OrderLogItem = {
  action_time: string;
  status: string;
  status_id: string;
};

export type ShippingLogItem = {
  action_time: string;
  reason?: string;
  reason_code?: string;
  status: string;
  status_id: string;
};
export type OrderDetailType = {
  _id: string;
  unique_id: string;
  user_id: string;
  status: OrderStatusType | string;
  checkout_price_data?: CheckoutPriceData;
  delivery_address?: DeliveryAddress;
  created_at: string;
  ghtk_label: string;
  items: Array<ProductItem>;
  payment_type: string;
  shipping_status: number;
  updated_at: string;
  user_created: string;
  user_updated: string;
  users: Array<any>;
  warehouse_id: string;
  shipping_logs: Array<ShippingLogItem>;
  order_logs: Array<OrderLogItem>;
};
