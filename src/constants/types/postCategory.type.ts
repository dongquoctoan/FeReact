import { CommonGetAllParams } from "constants/types/common.type";

export type GetPostCategoriesParams = CommonGetAllParams & {
  name?: string;
  status?: string;
  description?: string;
  start_time?: string;
  end_time?: string;
};

export type PostCategory = {
  _id: string;
  name: string;
  description: string;
  status: string;
  user_created: string;
  user_updated: string;
  created_at: string;
  updated_at: string;
};

export type CreatePostCategoryData = {
  name: string;
  description: string;
};

export type UpdatePostCategoryData = {
  name: string;
  description: string;
};
