import { lazy } from "react";
import { ADD_NEW_POST } from "routes/route.constant";
const AddPost = lazy(() => import("pages/AddPost"));

export default {
  path: ADD_NEW_POST,
  element: AddPost,
};
