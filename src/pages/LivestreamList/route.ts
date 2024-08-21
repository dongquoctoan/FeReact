import { lazy } from "react";
import { LIVESTREAM_LIST } from "routes/route.constant";

const LivestreamList = lazy(() => import("pages/LivestreamList"));

export default {
  path: LIVESTREAM_LIST,
  element: LivestreamList,
};
