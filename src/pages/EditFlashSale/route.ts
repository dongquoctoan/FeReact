import { lazy } from "react";
import { EDIT_FLASH_SALE } from "routes/route.constant";
const EditFlashSale = lazy(() => import("pages/EditFlashSale"));

export default {
  path: EDIT_FLASH_SALE,
  element: EditFlashSale,
};
