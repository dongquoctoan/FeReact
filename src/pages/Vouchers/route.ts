import { lazy } from "react";
import { VOUCHER } from "routes/route.constant";
const Vouchers = lazy(() => import("pages/Vouchers"));

export default {
  path: VOUCHER,
  element: Vouchers,
};
