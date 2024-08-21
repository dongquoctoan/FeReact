import { request } from "apis/base";
import {
  CreateProductCategoryData,
  GetProductCategoriesParams,
  UpdateProductCategoryData,
} from "constants/types/productCategory.type";

export const productCategoryApi = {
  getAll: (params?: GetProductCategoriesParams) => {
    return request("/admin/product-categories", {
      method: "GET",
      params,
    });
  },
  getSelection: () => {
    return request("/admin/product-categories/selection", {
      method: "GET",
    });
  },
  getOne: (productCategoryId: string) => {
    return request("/admin/product-categories/" + productCategoryId, {
      method: "GET",
    });
  },
  create: (data: CreateProductCategoryData) => {
    return request("/admin/product-categories", {
      method: "POST",
      data,
    });
  },
  update: (productCategoryId: string, data: UpdateProductCategoryData) => {
    return request("/admin/product-categories/" + productCategoryId, {
      method: "PUT",
      data,
    });
  },
  delete: (productCategoryId: string) => {
    return request("/admin/product-categories/" + productCategoryId, {
      method: "DELETE",
    });
  },
};
