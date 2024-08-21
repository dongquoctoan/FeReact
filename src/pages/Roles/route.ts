import { lazy } from "react";
import { ROLE } from "routes/route.constant";
const Roles = lazy(() => import("pages/Roles"));

export default {
  path: ROLE,
  element: Roles,
};
