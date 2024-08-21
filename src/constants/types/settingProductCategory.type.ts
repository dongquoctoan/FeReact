import { CommonGetAllParams } from "constants/types/common.type";

export type GetAllSettingProductCategoryParams = CommonGetAllParams & {
  name?: string;
  status?: string;
};

export type SettingProductCategory = {
  _id: string;
  name: string;
  file_name: string;
  file_content: string;
  status: string;
  is_common: boolean;
  product_category_ids: Array<string>;
  user_created: string;
  user_updated: string;
  created_at: string;
  updated_at: string;
};

export type CreateSettingProductCategory = {
  file: any;
  is_common: boolean;
  name: string;
  product_category_ids: Array<string>;
};

export type ProductExtensionItem = {
  type: string;
  key: string;
  label: string;
  required: boolean;
};
