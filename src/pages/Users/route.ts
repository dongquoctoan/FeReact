import { lazy } from "react";
import { USER } from "routes/route.constant";
const Users = lazy(() => import("pages/Users"));

export default {
  path: USER,
  element: Users,
};
