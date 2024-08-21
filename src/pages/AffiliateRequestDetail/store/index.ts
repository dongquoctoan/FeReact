import { createState } from "@hookstate/core";
import { affiliateApi } from "apis/affiliate";
import { message } from "antd";
import { AffiliateRequest } from "constants/types/affiliateRequest.type";

const initialState: AffiliateRequest = {
  _id: "",
  first_name: "",
  last_name: "",
  username: "",
  email: "",
  phone: "",
  status: "",
  affiliate_status: "WAITING_CONFIRM",
  link_social_media: "",
};

const store = createState(initialState);

export const getAffiliateRequestDetail = async (affiliateRequestId: string) => {
  try {
    const dataRes = await affiliateApi.getRequestDetail(affiliateRequestId);
    const detailRes = dataRes.data.result;
    store._id.set(detailRes._id);
    store.first_name.set(detailRes.first_name);
    store.last_name.set(detailRes.last_name);
    store.username.set(detailRes.username);
    store.phone.set(detailRes.phone);
    store.email.set(detailRes.email);
    store.status.set(detailRes.status);
    store.affiliate_status.set(detailRes.affiliate_status);
    store.link_social_media.set(detailRes.link_social_media);
  } catch (error: any) {
    message.error(error.response.data.error.message);
  }
};

export default store;
