import { request } from "apis/base";
import {
  GetWarehouseParams,
  CreateWarehouseData,
  UpdateWarehouseData,
} from "constants/types/warehouse.type";

export const warehouseApi = {
  getSelection: () => {
    return request("/admin/warehouse/selection", {
      method: "GET",
    });
  },
  getAll: (params?: GetWarehouseParams) => {
    return request("/admin/warehouse", {
      method: "GET",
      params,
    });
  },
  getDetail: (id: string) => {
    return request(`/admin/warehouse/${id}`, {
      method: "GET",
    });
  },
  create: (data: CreateWarehouseData) => {
    return request("/admin/warehouse", {
      method: "POST",
      data,
    });
  },
  update: (id: string, data: UpdateWarehouseData) => {
    return request(`/admin/warehouse/${id}`, {
      method: "PUT",
      data,
    });
  },
  delete: (id: string) => {
    return request(`/admin/warehouse/${id}`, {
      method: "DELETE",
    });
  },
};
