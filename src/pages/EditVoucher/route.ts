import { lazy } from "react";
import { EDIT_VOUCHER } from "routes/route.constant";
const EditVoucher = lazy(() => import("pages/EditVoucher"));

export default {
  path: EDIT_VOUCHER,
  element: EditVoucher,
};
