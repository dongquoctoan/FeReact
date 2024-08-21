import { lazy } from "react";
import { EDIT_LIVESTREAM } from "routes/route.constant";
const EditLivestream = lazy(() => import("pages/EditLivestream"));

export default {
  path: EDIT_LIVESTREAM,
  element: EditLivestream,
};
