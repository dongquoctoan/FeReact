import { request } from "apis/base";
import {
  CreatePostCategoryData,
  GetPostCategoriesParams,
  UpdatePostCategoryData,
} from "constants/types/postCategory.type";

export const postCategoryApi = {
  getAll: (params?: GetPostCategoriesParams) => {
    return request("/admin/post-category", {
      method: "GET",
      params,
    });
  },
  getSelection: () => {
    return request("/admin/post-category/selection", {
      method: "GET",
    });
  },
  getOne: (postCategoryId: string) => {
    return request("/admin/post-category/" + postCategoryId, {
      method: "GET",
    });
  },
  create: (data: CreatePostCategoryData) => {
    return request("/admin/post-category", {
      method: "POST",
      data,
    });
  },
  update: (postCategoryId: string, data: UpdatePostCategoryData) => {
    return request("/admin/post-category/" + postCategoryId, {
      method: "PUT",
      data,
    });
  },
  delete: (postCategoryId: string) => {
    return request("/admin/post-category/" + postCategoryId, {
      method: "DELETE",
    });
  },
};
