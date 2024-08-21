import { lazy } from "react";
import { PRODUCT } from "routes/route.constant";
const Products = lazy(() => import("pages/Products"));

export default {
  path: PRODUCT,
  element: Products,
};
