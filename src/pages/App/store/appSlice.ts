import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Option, ProductCategoryOption } from "constants/types/common.type";
import {
  GetSelectionProductCategoriesSuccessPayload,
  GetSelectionRolesSuccessPayload,
} from "pages/App/store/store.type";

interface AppState {
  isLogged: boolean;
  productCategoriesSelection: Array<ProductCategoryOption>;
  rolesSelection: Array<Option>;
}

const initialState: AppState = {
  isLogged: false,
  productCategoriesSelection: [],
  rolesSelection: [],
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    login: (state) => {
      state.isLogged = true;
    },
    logout: (state) => {
      state.isLogged = false;
    },
    getSelectionProductCategories: (state) => {
      return state;
    },
    getSelectionProductCategoriesSuccess: (
      state,
      action: PayloadAction<GetSelectionProductCategoriesSuccessPayload>
    ) => {
      state.productCategoriesSelection =
        action.payload.productCategoriesSelection;
    },
    // get roles
    getSelectionRoles: (state) => {
      return state;
    },
    getSelectionRolesSuccess: (
      state,
      action: PayloadAction<GetSelectionRolesSuccessPayload>
    ) => {
      state.rolesSelection = action.payload.rolesSelection;
    },
  },
});

export const {
  login,
  logout,
  getSelectionProductCategories,
  getSelectionProductCategoriesSuccess,
  getSelectionRoles,
  getSelectionRolesSuccess,
} = appSlice.actions;
export default appSlice.reducer;
