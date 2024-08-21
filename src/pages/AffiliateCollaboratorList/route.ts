import { lazy } from "react";
import { AFFILIATE_COLLABORATOR_LIST } from "routes/route.constant";
const AffiliateCollaboratorList = lazy(
  () => import("pages/AffiliateCollaboratorList")
);

export default {
  path: AFFILIATE_COLLABORATOR_LIST,
  element: AffiliateCollaboratorList,
};
