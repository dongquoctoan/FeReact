import { createState } from "@hookstate/core";
import flashSaleApi from "apis/flashsale";
import {
  FlashSale,
  GetAllFlashSaleParams,
} from "constants/types/flashsale.type";

type FlashSaleListState = {
  flashSales: Array<FlashSale>;
  limit: number;
  page: number;
  total: number;
  isFetchingFlashSales: boolean;
};

const initialState: FlashSaleListState = {
  flashSales: [],
  limit: 10,
  page: 1,
  total: 0,
  isFetchingFlashSales: true,
};

const store = createState(initialState);

export const fetchFlashSaleList = async (params?: GetAllFlashSaleParams) => {
  try {
    store.isFetchingFlashSales.set(true);
    const _params = {
      ...params,
      page: params?.page ? params.page : store.page.get(),
      limit: params?.limit ? params.limit : store.limit.get(),
    };
    const flashSaleListRes = await flashSaleApi.getAll(_params);

    store.set({
      flashSales: flashSaleListRes.data.result.docs,
      page: flashSaleListRes.data.result.page,
      limit: flashSaleListRes.data.result.limit,
      total: flashSaleListRes.data.result.totalDocs,
      isFetchingFlashSales: false,
    });
  } catch (error) {
    store.isFetchingFlashSales.set(false);
  }
};

export default store;
