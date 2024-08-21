import { lazy } from "react";
import { POST_CATEGORY } from "routes/route.constant";
const PostCategories = lazy(() => import("pages/PostCategory"));

export default {
  path: POST_CATEGORY,
  element: PostCategories,
};
