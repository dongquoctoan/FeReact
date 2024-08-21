import { lazy } from "react";
import { EDIT_POST } from "routes/route.constant";
const EditPost = lazy(() => import("pages/EditPost"));

export default {
  path: EDIT_POST,
  element: EditPost,
};
