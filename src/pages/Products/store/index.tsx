import { createState } from "@hookstate/core";
import { productApi } from "apis/product";
import { GetProductsParams } from "constants/types/product.type";

type ProductsState = {
  products: Array<any>;
  page: number;
  limit: number;
  total: number;
  isLoadingGetAllProduct: boolean;
};

const initialState: ProductsState = {
  products: [],
  page: 1,
  limit: 10,
  total: 0,
  isLoadingGetAllProduct: false,
};

const store = createState(initialState);

export const fetchProductList = async (params?: GetProductsParams) => {
  try {
    store.isLoadingGetAllProduct.set(true);
    const _params = {
      ...params,
      page: params?.page ? params.page : store.page.get(),
      limit: params?.limit ? params.limit : store.limit.get(),
    };
    const productsRes = await productApi.getAll(_params);

    store.set({
      products: productsRes.data.result.docs,
      page: productsRes.data.result.page,
      limit: productsRes.data.result.limit,
      total: productsRes.data.result.totalDocs,
      isLoadingGetAllProduct: false,
    });
  } catch (error) {
    store.isLoadingGetAllProduct.set(false);
  }
};

export default store;
