import { createState } from "@hookstate/core";
import { DiscountProductModel } from "constants/types/discount.type";
import { Product } from "constants/types/product.type";

export type DiscountProduct = {
  product?: Product;
  models: Array<DiscountProductModel>;
};

export type DiscountControlState = {
  name: string;
  start_time: string;
  end_time: string;
  discount_products: Array<DiscountProduct>;
};

const initialState: DiscountControlState = {
  name: "",
  start_time: "",
  end_time: "",
  discount_products: [],
};

const store = createState(initialState);

export const resetState = () => {
  store.set({
    discount_products: [],
    start_time: "",
    end_time: "",
    name: "",
  });
};

export default store;
