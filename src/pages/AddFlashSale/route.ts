import { lazy } from "react";
import { ADD_FLASH_SALE } from "routes/route.constant";
const AddFlashSale = lazy(() => import("pages/AddFlashSale"));

export default {
  path: ADD_FLASH_SALE,
  element: AddFlashSale,
};
