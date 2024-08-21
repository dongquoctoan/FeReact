import { lazy } from "react";
import { EDIT_PRODUCT } from "routes/route.constant";
const EditProduct = lazy(() => import("pages/EditProduct"));

export default {
  path: EDIT_PRODUCT,
  element: EditProduct,
};
