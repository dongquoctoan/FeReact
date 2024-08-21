import { lazy } from "react";
import { PRODUCT_CATEGORY } from "routes/route.constant";
const ProductCategories = lazy(() => import("pages/ProductCategories"));

export default {
  path: PRODUCT_CATEGORY,
  element: ProductCategories,
};
