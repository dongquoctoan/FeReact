import { lazy } from "react";
import { PERMISSION } from "routes/route.constant";
const Permissions = lazy(() => import("pages/Permissions"));

export default {
  path: PERMISSION,
  element: Permissions,
};
