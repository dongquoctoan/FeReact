import { request } from "apis/base";
import {
  CreateNewProductData,
  EditProductData,
  GetProductsParams,
} from "constants/types/product.type";

export const productApi = {
  getAll: (params?: GetProductsParams) => {
    return request("/admin/products", {
      method: "GET",
      params,
    });
  },
  getOne: (productId: string) => {
    return request("/admin/products/" + productId, {
      method: "GET",
    });
  },
  create: (data: CreateNewProductData) => {
    return request("/admin/products", {
      method: "POST",
      data,
    });
  },
  update: (productId: string, data: EditProductData) => {
    return request("/admin/products/" + productId, {
      method: "PUT",
      data,
    });
  },
  delete: (productId: string) => {
    return request("/admin/products/" + productId, {
      method: "DELETE",
    });
  },
};
