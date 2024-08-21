import { request } from "apis/base";
import {
  GetVoucherParams,
  CreateVoucherData,
  UpdateVoucherData,
} from "constants/types/voucher.type";

export const voucherApi = {
  getAll: (params?: GetVoucherParams) => {
    return request("/admin/vouchers", {
      method: "GET",
      params,
    });
  },
  getDetail: (id: string) => {
    return request(`/admin/vouchers/${id}`, {
      method: "GET",
    });
  },
  create: (data: CreateVoucherData) => {
    return request("/admin/vouchers", {
      method: "POST",
      data,
    });
  },
  update: (id: string, data: UpdateVoucherData) => {
    return request(`/admin/vouchers/${id}`, {
      method: "PUT",
      data,
    });
  },
  delete: (id: string) => {
    return request(`/admin/vouchers/${id}`, {
      method: "DELETE",
    });
  },
  finish: (id: string) => {
    return request(`/admin/vouchers/finish/${id}`, {
      method: "DELETE",
    });
  },
};
