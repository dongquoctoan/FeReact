import { request } from "apis/base";
import {
  CreatePostData,
  UpdatePostData,
  GetPostParams,
} from "constants/types/post.type";

export const postApi = {
  getAll: (params?: GetPostParams) => {
    return request("/admin/post", {
      method: "GET",
      params,
    });
  },
  getOne: (postId: string) => {
    return request("/admin/post/" + postId, {
      method: "GET",
    });
  },
  create: (data: CreatePostData) => {
    return request("/admin/post", {
      method: "POST",
      data,
    });
  },
  update: (postId: string, data: UpdatePostData) => {
    return request("/admin/post/" + postId, {
      method: "PUT",
      data,
    });
  },
  delete: (postId: string) => {
    return request("/admin/post/" + postId, {
      method: "DELETE",
    });
  },
};
