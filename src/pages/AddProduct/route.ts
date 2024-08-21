import { lazy } from "react";
import { ADD_NEW_PRODUCT } from "routes/route.constant";
const AddProduct = lazy(() => import("pages/AddProduct"));

export default {
  path: ADD_NEW_PRODUCT,
  element: AddProduct,
};
