import { lazy } from "react";
import { ADD_NEW_VOUCHER } from "routes/route.constant";
const AddVoucher = lazy(() => import("pages/AddVoucher"));

export default {
  path: ADD_NEW_VOUCHER,
  element: AddVoucher,
};
