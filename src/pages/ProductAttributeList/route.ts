import { lazy } from "react";
import { PRODUCT_ATTRIBUTE } from "routes/route.constant";
const ProductAttributeList = lazy(() => import("pages/ProductAttributeList"));

export default {
  path: PRODUCT_ATTRIBUTE,
  element: ProductAttributeList,
};
