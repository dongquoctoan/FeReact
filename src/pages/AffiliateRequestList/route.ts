import { lazy } from "react";
import { AFFILIATE_REQUEST_LIST } from "routes/route.constant";
const AffiliateRequestList = lazy(() => import("pages/AffiliateRequestList"));

export default {
  path: AFFILIATE_REQUEST_LIST,
  element: AffiliateRequestList,
};
