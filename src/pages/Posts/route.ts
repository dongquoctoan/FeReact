import { lazy } from "react";
import { POST } from "routes/route.constant";

const PostList = lazy(() => import("pages/Posts"));

export default {
  path: POST,
  element: PostList,
};
