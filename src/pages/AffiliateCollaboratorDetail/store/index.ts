import { createState } from "@hookstate/core";
import { affiliateApi } from "apis/affiliate";
import { RevenuePerMonth } from "constants/types/affiliateRequest.type";

type AffiliateCollaboratorDetailState = {
  data: Array<RevenuePerMonth>;
  isLoadingGetAllDetail: boolean;
  haveRevenue: boolean;
};

const initialState: AffiliateCollaboratorDetailState = {
  data: [],
  isLoadingGetAllDetail: false,
  haveRevenue: false,
};

const store = createState(initialState);

export const getAffiliateCollaboratorDetail = async (
  affiliateCollaboratorId: string
) => {
  try {
    store.isLoadingGetAllDetail.set(true);
    const dataRes = await affiliateApi.getRevenueDetail(
      affiliateCollaboratorId
    );
    store.data.set(dataRes.data.result[0].data);
    store.isLoadingGetAllDetail.set(false);
    store.haveRevenue.set(true);
  } catch (error: any) {
    store.isLoadingGetAllDetail.set(false);
    store.haveRevenue.set(false);
  }
};

export default store;
