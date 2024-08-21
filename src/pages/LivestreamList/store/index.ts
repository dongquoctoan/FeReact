import { LiveStream } from "constants/types/livestream.type";
import { CommonGetAllParams } from "constants/types/common.type";
import livestreamApi from "apis/livestream";
import { createState } from "@hookstate/core";

type LivestreamListState = {
  livestreamList: Array<LiveStream>;
  limit: number;
  page: number;
  total: number;
  isFetchingLivestream: boolean;
};

const initialState: LivestreamListState = {
  livestreamList: [],
  limit: 10,
  page: 1,
  total: 0,
  isFetchingLivestream: true,
};

const store = createState(initialState);

export const getLivestreamList = async (params?: CommonGetAllParams) => {
  try {
    store.isFetchingLivestream.set(true);
    const _params = {
      ...params,
      page: params?.page ? params.page : store.page.get(),
      limit: params?.limit ? params.limit : store.limit.get(),
    };
    const dataRes = await livestreamApi.getAll(_params);

    store.set({
      livestreamList: dataRes.data.result.docs,
      page: dataRes.data.result.page,
      limit: dataRes.data.result.limit,
      total: dataRes.data.result.totalDocs,
      isFetchingLivestream: false,
    });
  } catch (error) {
    store.isFetchingLivestream.set(false);
  }
};

export default store;
