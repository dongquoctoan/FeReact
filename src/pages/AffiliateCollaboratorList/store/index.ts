import { createState } from "@hookstate/core";
import { affiliateApi } from "apis/affiliate";
import { CommonGetAllParams } from "constants/types/common.type";
import { AffiliateCollaborator } from "constants/types/affiliateRequest.type";

type CollaboratorsState = {
  collaborators: Array<AffiliateCollaborator>;
  page: number;
  limit: number;
  isLoadingGetAllCollaborator: boolean;
};

const initialState: CollaboratorsState = {
  collaborators: [],
  page: 1,
  limit: 10,
  isLoadingGetAllCollaborator: false,
};

const store = createState(initialState);

export const getCollaboratorList = async (params?: CommonGetAllParams) => {
  try {
    store.isLoadingGetAllCollaborator.set(true);
    const _params = {
      ...params,
      page: params?.page ? params.page : store.page.get(),
      limit: params?.limit ? params.limit : store.limit.get(),
    };

    const datares = await affiliateApi.getCollaboratorList(_params);

    store.set({
      collaborators: datares.data.result.docs,
      page: datares.data.result.page,
      limit: datares.data.result.limit,
      isLoadingGetAllCollaborator: false,
    });
  } catch (error) {
    store.isLoadingGetAllCollaborator.set(false);
  }
};

export default store;
