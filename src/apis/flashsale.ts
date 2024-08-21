import { request } from "apis/base";
import {
  GetAllFlashSaleParams,
  NewFlashSaleData,
} from "constants/types/flashsale.type";

const flashSaleApi = {
  getAll: (params?: GetAllFlashSaleParams) => {
    return request("/admin/flashsales", {
      method: "GET",
      params,
    });
  },

  getDetail: (flashSaleId: string) => {
    return request(`/admin/flashsales/${flashSaleId}`, {
      method: "GET",
    });
  },

  create: (data: NewFlashSaleData) => {
    return request("/admin/flashsales", {
      method: "POST",
      data,
    });
  },

  update: (flashSaleId: string, data: NewFlashSaleData) => {
    return request("/admin/flashsales/" + flashSaleId, {
      method: "PUT",
      data,
    });
  },

  delete: (flashSaleId: string) => {
    return request(`/admin/flashsales/${flashSaleId}`, {
      method: "DELETE",
    });
  },

  finish: (flashSaleId: string) => {
    return request(`/admin/flashsales/finish/${flashSaleId}`, {
      method: "DELETE",
    });
  },
};

export default flashSaleApi;
