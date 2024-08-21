import { createState } from "@hookstate/core";

export type FlashSaleControlState = {
  title: string;
  description: string;
  content: string;
  post_category_ids: Array<string>;
};

const initialState: FlashSaleControlState = {
  title: "",
  description: "",
  content: "",
  post_category_ids: [],
};

const store = createState(initialState);

export const resetState = () => {
  store.set({
    title: "",
    description: "",
    content: "",
    post_category_ids: [],
  });
};

export default store;
