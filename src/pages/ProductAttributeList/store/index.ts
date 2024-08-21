import { createState } from "@hookstate/core";
import productAttributeApi from "apis/productAttribute";
import {
  GetProductAttributeListParams,
  ProductAttribute,
} from "constants/types/productAttribute.type";

type ProductAttributeListState = {
  page: number;
  limit: number;
  product_attributes: Array<ProductAttribute>;
  total: number;
  isFetchingProductAttributeList: boolean;
};

const initialState: ProductAttributeListState = {
  page: 1,
  limit: 10,
  product_attributes: [],
  total: 0,
  isFetchingProductAttributeList: true,
};

const store = createState(initialState);
export default store;

export const fetchProductAttributeList = async (
  params?: GetProductAttributeListParams
) => {
  try {
    store.isFetchingProductAttributeList.set(true);
    const productAttributeListRes = await productAttributeApi.getAll(params);
    store.set({
      page: productAttributeListRes.data.result.page,
      limit: productAttributeListRes.data.result.limit,
      total: productAttributeListRes.data.result.totalDocs,
      product_attributes: productAttributeListRes.data.result.docs,
      isFetchingProductAttributeList: false,
    });
  } catch (error) {
    store.isFetchingProductAttributeList.set(false);
  }
};
