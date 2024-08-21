import { lazy } from "react";
import { BANNER } from "routes/route.constant";
const Banner = lazy(() => import("pages/Banner"));

export default {
  path: BANNER,
  element: Banner,
};
