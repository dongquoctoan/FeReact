import { CommonGetAllParams } from "constants/types/common.type";

export type GetProductCategoriesParams = CommonGetAllParams & {
  name?: string;
  status?: string;
  start_time?: string;
  end_time?: string;
  parent_category_id?: string;
  affiliate_percent?: string;
};

export type ProductCategory = {
  _id: string;
  name: string;
  description: string;
  image: string;
  parent_category_id: string;
  parent_category_path: Array<string>;
  status: string;
  user_created: string;
  user_updated: string;
  created_at: string;
  updated_at: string;
  has_children?: boolean;
  //affiliate_percent: number | null;
  affiliate_percent_collaborator: number | null;
  affiliate_percent_customer: number | null;
};

export type CreateProductCategoryData = {
  name: string;
  description: string;
  image: string;
  parent_category_id?: string;
  parent_category_path?: Array<string>;
  //affiliate_percent?: number | null;
  affiliate_percent_collaborator?: number | null;
  affiliate_percent_customer?: number | null;
};

export type UpdateProductCategoryData = {
  name: string;
  description: string;
  image: string;
  parent_category_id?: string;
  parent_category_path?: Array<string>;
  //affiliate_percent?: number | null;
  affiliate_percent_collaborator?: number | null;
  affiliate_percent_customer?: number | null;
};
