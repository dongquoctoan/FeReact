import { CommonGetAllParams } from "constants/types/common.type";

export type GetPermissionsParams = CommonGetAllParams & {
  name?: string;
  code?: string;
  group?: string;
};

export type Permission = {
  _id: string;
  name: string;
  code: string;
  group: string;
  created_at: string;
  updated_at: string;
};
