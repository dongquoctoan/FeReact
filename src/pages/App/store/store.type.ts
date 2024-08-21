import { Option, ProductCategoryOption } from "constants/types/common.type";

export type GetSelectionProductCategoriesSuccessPayload = {
  productCategoriesSelection: Array<ProductCategoryOption>;
};

export type GetSelectionRolesSuccessPayload = {
  rolesSelection: Array<Option>;
};
