import { productCategoryApi } from "apis/productCategory";
import {
  GetProductCategoriesParams,
  ProductCategory,
} from "constants/types/productCategory.type";
import { useEffect, useState } from "react";

export type ProductCategoriesState = {
  productCategories: Array<ProductCategory>;
  page: number;
  limit: number;
  total: number;
  isLoadingGetAllProductCategory: boolean;
};

const initialState: ProductCategoriesState = {
  productCategories: [],
  page: 1,
  limit: 10,
  total: 0,
  isLoadingGetAllProductCategory: false,
};

const useQueryProductCategories = () => {
  const [productCategoriesState, setProductCategoriesState] =
    useState<ProductCategoriesState>(initialState);

  const handleGetProductCategories = async (
    params?: GetProductCategoriesParams
  ) => {
    try {
      setProductCategoriesState((state) => ({
        ...state,
        isLoadingGetAllProductCategory: true,
      }));

      const _params = {
        ...params,
        page: params?.page ? params.page : productCategoriesState.page,
        limit: params?.limit ? params.limit : productCategoriesState.limit,
      };

      const productCategoriesRes = await productCategoryApi.getAll(_params);
      setProductCategoriesState((state) => ({
        ...state,
        productCategories: productCategoriesRes.data.result.docs,
        page: productCategoriesRes.data.result.page,
        limit: productCategoriesRes.data.result.limit,
        total: productCategoriesRes.data.result.totalDocs,
        isLoadingGetAllProductCategory: false,
      }));
    } catch (error) {
      setProductCategoriesState((state) => ({
        ...state,
        isLoadingGetAllProductCategory: false,
      }));
    }
  };

  useEffect(() => {
    handleGetProductCategories({ status: "actived" });
  }, []);

  return {
    productCategoriesState,
    handleGetProductCategories,
  };
};

export default useQueryProductCategories;
