import { lazy } from "react";
import { AFFILIATE_COLLABORATOR_PAYMENT_HISTORY } from "routes/route.constant";
const AffiliateCollaboratorPaymentHistory = lazy(
  () => import("pages/AffiliateCollabotaryPaymentHistory")
);

export default {
  path: AFFILIATE_COLLABORATOR_PAYMENT_HISTORY,
  element: AffiliateCollaboratorPaymentHistory,
};
