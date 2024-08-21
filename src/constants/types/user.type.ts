import { CommonGetAllParams } from "constants/types/common.type";

export type GetUsersParams = CommonGetAllParams & {
  last_name?: string;
  email?: string;
  phone?: string;
  status?: string;
  start_time?: number;
  end_time?: number;
};

export type User = {
  _id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  status: string;
  user_created: string;
  user_updated: string;
  created_at: string;
  updated_at: string;
  roles?: Array<any>;
};

export type CreateUserData = {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  roles: Array<string>;
};

export type EditUserData = {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  roles: Array<string>;
};
