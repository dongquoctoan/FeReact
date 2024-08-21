import { lazy } from "react";
import { ROLE_DETAIL } from "routes/route.constant";
const RoleDetail = lazy(() => import("pages/RoleDetail"));

export default {
  path: ROLE_DETAIL,
  element: RoleDetail,
};
