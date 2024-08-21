import { createState } from "@hookstate/core";
import { orderApi } from "apis/order";
import { GetOrderParams } from "constants/types/order.type";
import { Order } from "constants/types/order.type";

type OrderState = {
  orders: Array<Order>;
  page: number;
  limit: number;
  total: number;
  isLoadingGetAllOrder: boolean;
};

const initialState: OrderState = {
  orders: [],
  page: 1,
  limit: 10,
  total: 0,
  isLoadingGetAllOrder: false,
};

const store = createState(initialState);

export const getAllOrder = async (params?: GetOrderParams) => {
  try {
    store.isLoadingGetAllOrder.set(true);
    const _params: any = {
      ...params,
      page: params?.page ? params.page : store.page.get(),
      limit: params?.limit ? params.limit : store.limit.get(),
    };

    const dataRes = await orderApi.getAll(_params);
    store.set({
      ...store.value,
      orders: dataRes.data.result.docs,
      page: dataRes.data.result.page,
      limit: dataRes.data.result.limit,
      total: dataRes.data.result.totalDocs,
      isLoadingGetAllOrder: false,
    });
  } catch (error) {
    store.isLoadingGetAllOrder.set(false);
  }
};

export default store;
