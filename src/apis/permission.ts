import { GetPermissionsParams } from "constants/types/permission.type";
import { request } from "apis/base";

const permissionApi = {
  getAll: (params?: GetPermissionsParams) => {
    return request("/admin/permissions", {
      method: "GET",
      params,
    });
  },
};

export default permissionApi;
