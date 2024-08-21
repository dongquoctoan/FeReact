import { createState } from "@hookstate/core";
import { roleApi } from "apis/role";
import { GetRolesParams, Role } from "constants/types/role.type";

type RolesState = {
  roles: Array<Role>;
  limit: number;
  page: number;
  total: number;
  isLoadingGetAllRole: boolean;
};

const initialState: RolesState = {
  roles: [],
  limit: 10,
  page: 1,
  total: 0,
  isLoadingGetAllRole: true,
};

const store = createState(initialState);

export const fetchRoleList = async (params?: GetRolesParams) => {
  try {
    store.isLoadingGetAllRole.set(true);
    const _params = {
      ...params,
      page: params?.page ? params.page : store.page.get(),
      limit: params?.limit ? params.limit : store.limit.get(),
    };
    const rolesRes = await roleApi.getAll(_params);

    store.set({
      roles: rolesRes.data.result.docs,
      page: rolesRes.data.result.page,
      limit: rolesRes.data.result.limit,
      total: rolesRes.data.result.totalDocs,
      isLoadingGetAllRole: false,
    });
  } catch (error) {
    store.isLoadingGetAllRole.set(false);
  }
};

export default store;
