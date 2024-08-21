import { lazy } from "react";
import { ORDER } from "routes/route.constant";
const Order = lazy(() => import("pages/Order"));

export default {
  path: ORDER,
  element: Order,
};
