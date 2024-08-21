import { lazy } from "react";
import { AFFILIATE_COLLABORATOR_DETAIL } from "routes/route.constant";
const AffiliateCollaboratorDetail = lazy(
  () => import("pages/AffiliateCollaboratorDetail")
);

export default {
  path: AFFILIATE_COLLABORATOR_DETAIL,
  element: AffiliateCollaboratorDetail,
};
