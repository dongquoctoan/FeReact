import { CommonGetAllParams } from "constants/types/common.type";
import { PostCategory } from "constants/types/postCategory.type";

export type GetPostParams = CommonGetAllParams & {
  status?: string;
  title?: string;
  description?: string;

  start_time?: string;
  end_time?: string;
};

export type Post = {
  _id: string;
  title: string;
  description: string;
  content: string;
  post_category_ids: Array<string>;
  post_category_docs: Array<PostCategory>;
  status: string;
  user_created: string;
  user_updated: string;
  created_at: string;
  updated_at: string;
};

export type CreatePostData = {
  title: string;
  description: string;
  content: string;
  post_category_ids: Array<string>;
};

export type UpdatePostData = {
  title: string;
  description: string;
  content: string;
  post_category_ids: Array<string>;
};
