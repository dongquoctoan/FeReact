import { CommonGetAllParams } from "constants/types/common.type";

export type GetWarehouseParams = CommonGetAllParams & {
  status?: string;
};

export type Warehouse = {
  _id?: string;
  name: string;
  code: string;
  description: string;
  city_id: string;
  district_id: string;
  ward_id: string;
  address_line: string;
  phone: string;
  manager_name: string;
};

export type CreateWarehouseData = {
  name: string;
  code: string;
  description: string;
  city_id: string;
  district_id: string;
  ward_id: string;
  address_line: string;
  phone: string;
  manager_name: string;
};
export type UpdateWarehouseData = {
  name: string;
  code: string;
  description: string;
  city_id: string;
  district_id: string;
  ward_id: string;
  address_line: string;
  phone: string;
  manager_name: string;
};
