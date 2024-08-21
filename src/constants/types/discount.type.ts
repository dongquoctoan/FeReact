import {
  CommonGetAllParams,
  PromotionStatus,
} from "constants/types/common.type";
import { Product } from "constants/types/product.type";

export type DiscountProductModel = {
  _id?: string;
  promotion_price: number;
  user_item_limit: number;
  promotion_stock: number;
  is_actived: boolean;
  discount_id?: string;
  product_model_id: string;
  product_id: string;
  stock: number;
  name: string;
  price: number;
  product?: Product;
};

export type Discount = {
  _id: string;
  name: string;
  start_time: string;
  end_time: string;
  status: PromotionStatus;
  user_created: string;
  created_at: string;
  updated_at: string;
  discount_product_models?: Array<DiscountProductModel>;
};

export type GetDiscountListParams = CommonGetAllParams & {
  name?: string;
  code?: string;
  status?: string;
  start_time?: string;
  end_time?: string;
};

type NewDiscountProductModel = {
  product_id: string;
  product_model_id: string;
  promotion_price: string;
  promotion_stock: string;
  user_item_limit: string;
  is_actived: boolean;
};

export type NewDiscountData = {
  name: string;
  start_time: string;
  end_time: string;
  discount_product_models: Array<NewDiscountProductModel>;
};
