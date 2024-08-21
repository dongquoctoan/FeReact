import { createState } from "@hookstate/core";
import { customerApi } from "apis/customer";
import { Customer, GetCustomersParams } from "constants/types/customer.type";

type CustomersState = {
  customers: Array<Customer>;
  page: number;
  limit: number;
  total: number;
  isLoadingGetAllCustomer: boolean;
};

const initialState: CustomersState = {
  customers: [],
  page: 1,
  limit: 10,
  total: 0,
  isLoadingGetAllCustomer: false,
};

const store = createState(initialState);

export const fetchCustomerList = async (params?: GetCustomersParams) => {
  try {
    store.isLoadingGetAllCustomer.set(true);
    const _params = {
      ...params,
      page: params?.page ? params.page : store.page.get(),
      limit: params?.limit ? params.limit : store.limit.get(),
    };

    const customersRes = await customerApi.getAll(_params);

    store.set({
      customers: customersRes.data.result.docs,
      page: customersRes.data.result.page,
      limit: customersRes.data.result.limit,
      total: customersRes.data.result.totalDocs,
      isLoadingGetAllCustomer: false,
    });
  } catch (error) {
    store.isLoadingGetAllCustomer.set(false);
  }
};

export default store;
