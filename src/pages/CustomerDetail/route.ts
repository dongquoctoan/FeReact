import { lazy } from "react";
import { CUSTOMER_DETAIL } from "routes/route.constant";
const CustomerDetail = lazy(() => import("pages/CustomerDetail"));

export default {
  path: CUSTOMER_DETAIL,
  element: CustomerDetail,
};
