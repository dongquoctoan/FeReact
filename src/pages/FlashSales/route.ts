import { lazy } from "react";
import { LIST_FLASH_SALE } from "routes/route.constant";

const FlashSaleList = lazy(() => import("pages/FlashSales"));

export default {
  path: LIST_FLASH_SALE,
  element: FlashSaleList,
};
