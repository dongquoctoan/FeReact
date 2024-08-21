import { request } from "apis/base";
import {
  CreatePermissionRoleData,
  GetAllPermissionRoleParams,
} from "constants/types/permissionRole.type";

const permissionRoleApi = {
  getAll: (params?: GetAllPermissionRoleParams) => {
    return request("/admin/permission-roles", {
      method: "GET",
      params,
    });
  },
  create: (data: CreatePermissionRoleData) => {
    return request("/admin/permission-roles", {
      method: "POST",
      data,
    });
  },
  delete: (permissionRoleId: string) => {
    return request("/admin/permission-roles/" + permissionRoleId, {
      method: "DELETE",
    });
  },
};

export default permissionRoleApi;
