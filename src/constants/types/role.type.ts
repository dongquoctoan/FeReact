import { CommonGetAllParams } from "constants/types/common.type";
import { Permission } from "constants/types/permission.type";

export type GetRolesParams = CommonGetAllParams & {
  name?: string;
  code?: string;
  status?: string;
  start_time?: string;
  end_time?: string;
};

export type Role = {
  _id: string;
  name: string;
  description: string;
  code: string;
  status: string;
  is_default: boolean;
  user_created: string;
  user_updated: string;
  created_at: string;
  updated_at: string;
  permissions: Array<Permission>;
};

export type CreateRoleData = {
  name: string;
  description: string;
  code: string;
};

export type EditRoleData = {
  name: string;
  description: string;
};
