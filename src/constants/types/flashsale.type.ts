import {
  CommonGetAllParams,
  PromotionStatus,
} from "constants/types/common.type";
import { Product } from "constants/types/product.type";

export type FlashSaleProductModel = {
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

export type GetAllFlashSaleParams = CommonGetAllParams & {
  name?: string;
  code?: string;
  status?: string;
  start_time?: string;
  end_time?: string;
};

export type FlashSale = {
  _id: string;
  name: string;
  start_time: string;
  end_time: string;
  status: PromotionStatus;
  user_created: string;
  created_at: string;
  updated_at: string;
  flashSale_product_models?: Array<FlashSaleProductModel>;
};

type NewFlashSaleProductModel = {
  product_id: string;
  product_model_id: string;
  promotion_price: string;
  promotion_stock: string;
  user_item_limit: string;
  is_actived: boolean;
};

export type NewFlashSaleData = {
  name: string;
  start_time: string;
  end_time: string;
  flashsale_product_models: Array<NewFlashSaleProductModel>;
};
