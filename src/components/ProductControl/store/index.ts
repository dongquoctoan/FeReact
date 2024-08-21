import { createState } from "@hookstate/core";
import { warehouseApi } from "apis/warehouse";
import { Option } from "constants/types/common.type";

type ProductControlState = {
  warehouseSelection: Array<Option>;
  isFetchingWarehouseSelection: boolean;
};

const initialState: ProductControlState = {
  warehouseSelection: [],
  isFetchingWarehouseSelection: false,
};

const store = createState(initialState);

export const fetchWarehouseSelection = async () => {
  try {
    store.isFetchingWarehouseSelection.set(true);

    const warehouseSelectionRes = await warehouseApi.getSelection();

    store.set({
      warehouseSelection: warehouseSelectionRes.data.result,
      isFetchingWarehouseSelection: false,
    });
  } catch (error) {
    store.isFetchingWarehouseSelection.set(false);
  }
};

export default store;
