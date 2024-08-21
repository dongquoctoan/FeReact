import { lazy } from "react";
import { WAREHOUSE } from "routes/route.constant";
const Warehouse = lazy(() => import("pages/Warehouse"));

export default {
  path: WAREHOUSE,
  element: Warehouse,
};
