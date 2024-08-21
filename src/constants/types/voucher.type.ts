import { CommonGetAllParams } from "constants/types/common.type";

export type GetVoucherParams = CommonGetAllParams & {
  status?: string;
};

export type CreateVoucherData = {
  name: string;
  code: string;
  start_time: string;
  end_time: string;
  minimum_order_apply: number;
  usage_quantity: number;
  type: string;
  discount_percent: number | null;
  discount_amount: number | null;
  product_ids: string[];
};
export type UpdateVoucherData = {
  name: string;
  code: string;
  start_time: string;
  end_time: string;
  minimum_order_apply: number;
  usage_quantity: number;
  type: string;
  discount_percent: number | null;
  discount_amount: number | null;
  product_ids: string[];
};
