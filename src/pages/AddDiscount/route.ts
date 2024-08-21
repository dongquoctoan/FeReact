import { lazy } from "react";
import { ADD_DISCOUNT } from "routes/route.constant";
const AddDiscount = lazy(() => import("pages/AddDiscount"));

export default {
  path: ADD_DISCOUNT,
  element: AddDiscount,
};
