import { request } from "apis/base";
import {
  CreateRoleData,
  EditRoleData,
  GetRolesParams,
} from "constants/types/role.type";

export const roleApi = {
  getAll: (params?: GetRolesParams) => {
    return request("/admin/roles", {
      method: "GET",
      params,
    });
  },
  getOne: (roleId: string) => {
    return request("/admin/roles/" + roleId, {
      method: "GET",
    });
  },
  delete: (roleId: string) => {
    return request("/admin/roles/" + roleId, {
      method: "DELETE",
    });
  },
  getSelection: () => {
    return request("/admin/roles/selection", {
      method: "GET",
    });
  },
  create: (data: CreateRoleData) => {
    return request("/admin/roles", {
      method: "POST",
      data,
    });
  },
  update: (roleId: string, data: EditRoleData) => {
    return request("/admin/roles/" + roleId, {
      method: "PUT",
      data,
    });
  },
};
