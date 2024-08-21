import { lazy } from "react";
import { DISCOUNT_LIST } from "routes/route.constant";
const DiscountList = lazy(() => import("pages/DiscountList"));

export default {
  path: DISCOUNT_LIST,
  element: DiscountList,
};
