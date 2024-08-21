import { request } from "apis/base";
import {
  GetDiscountListParams,
  NewDiscountData,
} from "constants/types/discount.type";

const discountApi = {
  getAll: (params?: GetDiscountListParams) => {
    return request("/admin/discounts", {
      method: "GET",
      params,
    });
  },
  getDiscountProductItemList: (productIds: Array<string>) => {
    return request("/admin/discounts/products", {
      method: "GET",
      params: {
        product_ids: JSON.stringify(productIds),
      },
    });
  },
  create: (data: NewDiscountData) => {
    return request("/admin/discounts", {
      method: "POST",
      data,
    });
  },
  getDetail: (discountId: string) => {
    return request("/admin/discounts/" + discountId, {
      method: "GET",
    });
  },
  update: (discountId: string, data: NewDiscountData) => {
    return request("/admin/discounts/" + discountId, {
      method: "PUT",
      data,
    });
  },
  delete: (discountId: string) => {
    return request("/admin/discounts/" + discountId, {
      method: "DELETE",
    });
  },
  finish: (discountId: string) => {
    return request("/admin/discounts/finish/" + discountId, {
      method: "DELETE",
    });
  },
};

export default discountApi;
