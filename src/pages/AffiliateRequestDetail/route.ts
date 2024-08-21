import { lazy } from "react";
import { AFFILIATE_REQUEST_DETAIL } from "routes/route.constant";
const AffiliateRequestDetail = lazy(
  () => import("pages/AffiliateRequestDetail")
);

export default {
  path: AFFILIATE_REQUEST_DETAIL,
  element: AffiliateRequestDetail,
};
