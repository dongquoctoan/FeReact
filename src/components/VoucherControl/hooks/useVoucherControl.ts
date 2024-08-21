import { productApi } from "apis/product";
import { GetProductsParams, Product } from "constants/types/product.type";
import {
  VOUCHER_ALL_PRODUCT_TYPE,
  VOUCHER_PRODUCT_TYPE,
} from "constants/Voucher/voucherType";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";

export type GetAllProductData = {
  products: Array<Product>;
  page: number;
  limit: number;
  total: number;
  isLoadingGetAllSelectedProduct: boolean;
};

export type VoucherControlState = {
  name: string;
  code: string;
  start_time: string;
  end_time: string;
  usage_quantity: number;
  discount_percent: number | null;
  discount_amount: number | null;
  maximum_discount_amount: number | null;
  type: string;
  is_discount_percent: boolean;
  minimum_order_apply: number;
  is_private: boolean;
  product_ids: Array<string>;
  status: string;
};

const initialValue: VoucherControlState = {
  name: "",
  code: "",
  start_time: "",
  end_time: "",
  usage_quantity: 0,
  discount_percent: null,
  discount_amount: null,
  maximum_discount_amount: null,
  type: VOUCHER_ALL_PRODUCT_TYPE,
  is_discount_percent: false,
  minimum_order_apply: 0,
  is_private: false,
  product_ids: [],
  status: "",
};

const initialSelectedProducts: GetAllProductData = {
  products: [],
  page: 1,
  limit: 10,
  total: 0,
  isLoadingGetAllSelectedProduct: false,
};

const schemaVoucherControl = Yup.object().shape({
  name: Yup.string().trim().required("Tên Voucher không được để trống"),
  code: Yup.string().trim().required("Mã Voucher không được để trống"),
  start_time: Yup.string().trim().required("Thời gian không được để trống"),
  end_time: Yup.string().trim().required("Thời gian không được để trống"),
  minimum_order_apply: Yup.number()
    .nullable()
    .min(1, "Giá trị đơn hàng tối thiểu phải lớn hơn 0"),
  maximum_discount_amount: Yup.number().nullable(),
  discount_percent: Yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .test(
      "discountPercentValidate",
      "Không được để trống mục giảm giá theo phần trăm",
      (value, ctx) => {
        if (!ctx.parent.is_discount_percent && ctx.parent.discount_percent)
          return true;
        else {
          if (!ctx.parent.is_discount_percent) return true;
          if (typeof value === "undefined") return false;
          else {
            if (value > 0) {
              return true;
            }
          }
        }
        return false;
      }
    )
    .test(
      "maxDiscountPercentValidate",
      "Giảm giá phải bé hơn 100%",
      (value, ctx) => {
        if (!ctx.parent.is_discount_percent) return true;
        else {
          if (typeof value === "undefined") return false;
          else {
            if (value < 100) {
              return true;
            }
          }
        }
        return false;
      }
    ),
  discount_amount: Yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .test(
      "discountAmountValidate",
      "Không được để trống mục giảm giá theo tiền",
      (value, ctx) => {
        if (ctx.parent.is_discount_percent) return true;
        else {
          if (ctx.parent.discount_percent >= 0) return true;
          if (typeof value === "undefined") return false;
          else {
            if (value > 0) {
              return true;
            }
          }
        }
        return false;
      }
    ),
  usage_quantity: Yup.number().min(1, "Lượt sử dụng phải lớn hơn 0"),
  product_ids: Yup.array().test(
    "totalValidate",
    "Sản phẩm không được để trống",
    (value, ctx) => {
      if (ctx.parent.type === VOUCHER_PRODUCT_TYPE) {
        if (value?.length === 0) {
          return false;
        }
      }
      return true;
    }
  ),
});

const useVoucherControl = (
  onSubmit: (data: VoucherControlState) => void,
  initialState?: VoucherControlState
) => {
  const [selectedProductsState, setSelectedProductsState] =
    useState<GetAllProductData>(initialSelectedProducts);

  const formVoucherControl = useFormik({
    initialValues: initialValue,
    validationSchema: schemaVoucherControl,
    onSubmit: (data) => {
      onSubmit(data);
    },
  });

  useEffect(() => {
    if (initialState) {
      formVoucherControl.setValues(initialState);
      handleGetSelectedProduct();
    }
  }, [initialState]);

  useEffect(() => {
    handleGetSelectedProduct();
  }, [formVoucherControl.values.product_ids]);

  const handleChangeVoucherState = (data: object) => {
    formVoucherControl.setValues((state) => ({
      ...state,
      ...data,
    }));
  };

  const handleGetSelectedProduct = async (params?: GetProductsParams) => {
    try {
      setSelectedProductsState((state) => ({
        ...state,
        isLoadingGetAllSelectedProduct: false,
      }));
      const _params: GetProductsParams = {
        ...params,
        page: params?.page ? params.page : selectedProductsState.page,
        limit: params?.limit ? params.limit : selectedProductsState.limit,
        product_ids: params?.product_ids
          ? params.product_ids
          : JSON.stringify(formVoucherControl.values.product_ids),
      };

      const productsRes = await productApi.getAll(_params);
      setSelectedProductsState((state) => ({
        ...state,
        products: productsRes.data.result.docs,
        page: productsRes.data.result.page,
        limit: productsRes.data.result.limit,
        total: productsRes.data.result.totalDocs,
        isLoadingGetAllSelectedProduct: false,
      }));
    } catch (error) {
      setSelectedProductsState((state) => ({
        ...state,
        isLoadingGetAllSelectedProduct: true,
      }));
    }
  };

  return {
    touched: formVoucherControl.touched,
    errors: formVoucherControl.errors,
    voucherControlState: formVoucherControl.values,
    selectedProductsState,
    handleChangeVoucherState,
    handleGetSelectedProduct,
    handleSubmit: formVoucherControl.submitForm,
    handleChange: formVoucherControl.handleChange,
    handleBlur: formVoucherControl.handleBlur,
  };
};

export default useVoucherControl;
