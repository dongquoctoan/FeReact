import { request } from "apis/base";
import {
  CreateProductAttributeData,
  EditProductAttributeData,
  GetProductAttributeListParams,
} from "constants/types/productAttribute.type";

const productAttributeApi = {
  getAll: (params?: GetProductAttributeListParams) => {
    return request("/admin/product-attributes", {
      method: "GET",
      params,
    });
  },
  create: (data: CreateProductAttributeData) => {
    return request("/admin/product-attributes", {
      method: "POST",
      data,
    });
  },
  update: (data: EditProductAttributeData) => {
    return request("/admin/product-attributes/" + data._id, {
      method: "PUT",
      data,
    });
  },
  delete: (productAttributeId: string) => {
    return request("/admin/product-attributes/" + productAttributeId, {
      method: "DELETE",
    });
  },
};

export default productAttributeApi;
