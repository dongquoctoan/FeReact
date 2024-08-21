import {
  GetAllCustomerAddressParams,
  CreateCustomerAddressData,
  UpdateCustomerAddressData,
} from "constants/types/customerAddress.type";
import { request } from "apis/base";

export const customerAddressApi = {
  getAll: (customerId: string, params?: GetAllCustomerAddressParams) => {
    return request("/admin/address/" + customerId, {
      method: "GET",
      params,
    });
  },
  delete: (customerAddressId: string) => {
    return request(`/admin/address/${customerAddressId}`, {
      method: "DELETE",
    });
  },
  setDefault: (customerAddressId: string) => {
    return request("/admin/customer-address/" + customerAddressId, {
      method: "PUT",
    });
  },
  create: (data: CreateCustomerAddressData) => {
    return request("/admin/address/", {
      method: "POST",
      data,
    });
  },
  update: (customerAddressId: string, data: UpdateCustomerAddressData) => {
    console.log(customerAddressId, data);
    return request(`/admin/address/${customerAddressId}`, {
      method: "PUT",
      data,
    });
  },
};
