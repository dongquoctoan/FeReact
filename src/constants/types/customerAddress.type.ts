import { CommonGetAllParams } from "constants/types/common.type";

export type GetAllCustomerAddressParams = CommonGetAllParams & {
  customerAddress?: string;
  phone?: string;
  status?: string;
};

export type CustomerAddress = {
  _id?: string;
  name: string;
  city_id: string;
  district_id: string;
  ward_id: string;
  address_line: string;
  phone: string;
  email: string;
  is_default: boolean;
};

export type CreateCustomerAddressData = {
  user_id: string;
  name: string;
  city_id: string;
  district_id: string;
  ward_id: string;
  address_line: string;
  phone: string;
  email: string;
  is_default: boolean;
};
export type UpdateCustomerAddressData = {
  name: string;
  city_id: string;
  district_id: string;
  ward_id: string;
  address_line: string;
  phone: string;
  email: string;
  is_default: boolean;
};
