import { CommonGetAllParams } from "constants/types/common.type";

export type GetCustomersParams = CommonGetAllParams & {
  last_name?: string;
  email?: string;
  phone?: string;
  status?: string;
  start_time?: number;
  end_time?: number;
};

export type Customer = {
  _id: string;
  first_name: string;
  last_name: string;
  username: string;
  date_of_birth: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type LockCustomerData = {
  user_id: string;
  user_lock_reason_code_id: string;
  content: string;
};

export type CreateNewCustomerData = {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
};

export type EditCustomerData = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  username: string;
  date_of_birth: string;
};
