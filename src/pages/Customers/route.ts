import { lazy } from "react";
import { LIST_CUSTOMER } from "routes/route.constant";
const Customers = lazy(() => import("pages/Customers"));

export default {
  path: LIST_CUSTOMER,
  element: Customers,
};
