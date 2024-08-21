import { createState } from "@hookstate/core";
import { FlashSaleProductModel } from "constants/types/flashsale.type";
import { Product } from "constants/types/product.type";

export type FlashSaleProduct = {
  product?: Product;
  models: Array<FlashSaleProductModel>;
};

export type FlashSaleControlState = {
  name: string;
  start_time: string;
  end_time: string;
  flashsale_products: Array<FlashSaleProduct>;
};

const initialState: FlashSaleControlState = {
  name: "",
  start_time: "",
  end_time: "",
  flashsale_products: [],
};

const store = createState(initialState);

export const resetState = () => {
  store.set({
    flashsale_products: [],
    start_time: "",
    end_time: "",
    name: "",
  });
};

export default store;
