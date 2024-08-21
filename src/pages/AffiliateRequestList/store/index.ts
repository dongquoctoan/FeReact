import { createState } from "@hookstate/core";
import { affiliateApi } from "apis/affiliate";
import { CommonGetAllParams } from "constants/types/common.type";
import {
  AffiliateRequest,
  GetAffiliateRequestParams,
} from "constants/types/affiliateRequest.type";

type RequestsState = {
  requests: Array<AffiliateRequest>;
  page: number;
  limit: number;
  total: number;
  isLoadingGetAllRequest: boolean;
};

const initialState: RequestsState = {
  requests: [],
  page: 1,
  limit: 10,
  total: 0,
  isLoadingGetAllRequest: false,
};

const store = createState(initialState);

export const getAffiliateRequestList = async (params?: CommonGetAllParams) => {
  try {
    store.isLoadingGetAllRequest.set(true);
    const _params = {
      ...params,
      page: params?.page ? params.page : store.page.get(),
      limit: params?.limit ? params.limit : store.limit.get(),
    };

    const customersRes = await affiliateApi.getRequestList(_params);

    store.set({
      requests: customersRes.data.result.docs,
      page: customersRes.data.result.page,
      limit: customersRes.data.result.limit,
      total: customersRes.data.result.totalDocs,
      isLoadingGetAllRequest: false,
    });
  } catch (error) {
    store.isLoadingGetAllRequest.set(false);
  }
};

export default store;
