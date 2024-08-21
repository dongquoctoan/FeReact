import { lazy } from "react";
import { EDIT_DISCOUNT } from "routes/route.constant";
const EditDiscount = lazy(() => import("pages/EditDiscount"));

export default {
  path: EDIT_DISCOUNT,
  element: EditDiscount,
};
