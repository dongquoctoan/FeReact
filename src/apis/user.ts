import { request } from "apis/base";
import {
  CreateUserData,
  EditUserData,
  GetUsersParams,
} from "constants/types/user.type";

export const userApi = {
  getAll: (params?: GetUsersParams) => {
    return request("/admin/users", {
      method: "GET",
      params,
    });
  },
  delete: (userId: string) => {
    return request("/admin/users/" + userId, {
      method: "DELETE",
    });
  },
  create: (data: CreateUserData) => {
    return request("/admin/users", {
      method: "POST",
      data,
    });
  },
  update: (userId: string, data: EditUserData) => {
    return request("/admin/users/" + userId, {
      method: "PUT",
      data,
    });
  },
};
