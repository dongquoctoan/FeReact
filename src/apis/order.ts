import { request } from "apis/base";
import { GetOrderParams } from "constants/types/order.type";
import { method } from "lodash";

export const orderApi = {
  getAll: (params?: GetOrderParams) => {
    return request("/admin/order", {
      method: "GET",
      params,
    });
  },
  cancelOrder: (orderId: string) => {
    return request(`/admin/order/${orderId}`, {
      method: "PUT",
    });
  },
  getOne: (orderId: string) => {
    return request(`/admin/order/${orderId}`, {
      method: "GET",
    });
  },
  confirmOrder: (orderId: string) => {
    return request("/admin/order/confirm", {
      method: "POST",
      data: {
        order_id: orderId,
      },
    });
  },
  printDelivery: (deliveryCode: string) => {
    return request(`/admin/order/label/${deliveryCode}`, {
      method: "GET",
      responseType: "arraybuffer",
    });
  },
};
