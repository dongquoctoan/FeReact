import { lazy } from "react";
import { ORDER_DETAIL } from "routes/route.constant";
const OrderDetail = lazy(() => import("pages/OrderDetail"));

export default {
  path: ORDER_DETAIL,
  element: OrderDetail,
};
