import { createState } from "@hookstate/core";
import { warehouseApi } from "apis/warehouse";
import { GetWarehouseParams } from "constants/types/warehouse.type";

export type DataType = {
  _id: string;
  name: string;
  description: string;
  address_line: string;
  status: string;
  city_id: string;
  district_id: string;
  ward_id: string;
  created_at: string;
  manager_name: string;
  phone: string;
};

type WarehouseState = {
  warehouses: DataType[];
  page: number;
  limit: number;
  total: number;
  isLoadingGetAllWarehouse: boolean;
};

const initialState: WarehouseState = {
  warehouses: [],
  page: 1,
  limit: 10,
  total: 0,
  isLoadingGetAllWarehouse: false,
};

const store = createState(initialState);

export const fetchWWarehouse = async (params?: GetWarehouseParams) => {
  try {
    store.isLoadingGetAllWarehouse.set(true);
    const _params: any = {
      ...params,
      page: params?.page ? params.page : store.page.get(),
      limit: params?.limit ? params.limit : store.limit.get(),
    };

    const warehouseRes = await warehouseApi.getAll(_params);
    store.set({
      ...store.value,
      warehouses: warehouseRes.data.result.docs,
      page: warehouseRes.data.result.page,
      limit: warehouseRes.data.result.limit,
      total: warehouseRes.data.result.totalDocs,
      isLoadingGetAllWarehouse: false,
    });
  } catch (error) {
    store.isLoadingGetAllWarehouse.set(false);
  }
};

export default store;
