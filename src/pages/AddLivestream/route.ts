import { lazy } from "react";
import { ADD_LIVESTREAM } from "routes/route.constant";
const AddLivestream = lazy(() => import("pages/AddLivestream"));

export default {
  path: ADD_LIVESTREAM,
  element: AddLivestream,
};
