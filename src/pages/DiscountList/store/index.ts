import { createState } from "@hookstate/core";
import discountApi from "apis/discount";
import { Discount, GetDiscountListParams } from "constants/types/discount.type";

type DiscountListState = {
  discounts: Array<Discount>;
  limit: number;
  page: number;
  total: number;
  isFetchingDiscounts: boolean;
};

const initialState: DiscountListState = {
  discounts: [],
  limit: 10,
  page: 1,
  total: 0,
  isFetchingDiscounts: true,
};

const store = createState(initialState);

export const fetchDiscountList = async (params?: GetDiscountListParams) => {
  try {
    store.isFetchingDiscounts.set(true);
    const _params = {
      ...params,
      page: params?.page ? params.page : store.page.get(),
      limit: params?.limit ? params.limit : store.limit.get(),
    };
    const discountListRes = await discountApi.getAll(_params);

    store.set({
      discounts: discountListRes.data.result.docs,
      page: discountListRes.data.result.page,
      limit: discountListRes.data.result.limit,
      total: discountListRes.data.result.totalDocs,
      isFetchingDiscounts: false,
    });
  } catch (error) {
    store.isFetchingDiscounts.set(false);
  }
};

export default store;
