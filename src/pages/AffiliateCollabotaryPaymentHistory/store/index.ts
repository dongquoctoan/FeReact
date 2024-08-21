import { createState } from "@hookstate/core";
import { affiliateApi } from "apis/affiliate";
import { PaymentHistory } from "constants/types/affiliateRequest.type";

type AffiliateCollaboratorPaymentHistoryState = {
  data: Array<PaymentHistory>;
  isLoadingGetAllPaymentHistory: boolean;
};

const initialState: AffiliateCollaboratorPaymentHistoryState = {
  data: [],
  isLoadingGetAllPaymentHistory: false,
};

const store = createState(initialState);

export const getAffiliateCollaboratorPaymentHistory = async (
  affiliateCollaboratorId: string
) => {
  try {
    store.isLoadingGetAllPaymentHistory.set(true);
    const dataRes = await affiliateApi.getPaymentHistory(
      affiliateCollaboratorId
    );
    const paymentHistory = dataRes.data.result.affiliate_money.filter(
      (record: PaymentHistory) => record.affiliate_money_number !== 0
    );
    store.data.set(paymentHistory);
    store.isLoadingGetAllPaymentHistory.set(false);
  } catch (error: any) {
    store.isLoadingGetAllPaymentHistory.set(false);
  }
};

export default store;
