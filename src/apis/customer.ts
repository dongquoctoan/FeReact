import { request } from "apis/base";
import {
  LockCustomerData,
  CreateNewCustomerData,
  GetCustomersParams,
  EditCustomerData,
} from "constants/types/customer.type";

export const customerApi = {
  getAll: (params?: GetCustomersParams) => {
    return request("/admin/customers", {
      method: "GET",
      params,
    });
  },
  getOne: (customerId: string) => {
    return request("/admin/customers/" + customerId, {
      method: "GET",
    });
  },
  delete: (customerId: string) => {
    return request("/admin/customers/" + customerId, {
      method: "DELETE",
    });
  },
  lock: (data: LockCustomerData) => {
    return request("/admin/customers/lock", {
      method: "POST",
      data,
    });
  },
  create: (data: CreateNewCustomerData) => {
    return request("/admin/customers", {
      method: "POST",
      data,
    });
  },
  update: (id: string, data: EditCustomerData) => {
    return request("/admin/customers/" + id, {
      method: "PUT",
      data,
    });
  },
};
