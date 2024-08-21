import { request } from "apis/base";

export const bannerApi = {
  getAll: () => {
    return request("/admin/image-banner", {
      method: "GET",
    });
  },
  delete: (id: string) => {
    return request("/admin/image-banner/" + id, {
      method: "DELETE",
    });
  },
  create: (data: any) => {
    return request("/admin/image-banner", {
      method: "POST",
      data,
    });
  },
};
