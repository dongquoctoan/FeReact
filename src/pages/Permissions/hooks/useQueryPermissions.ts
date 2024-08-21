import permissionApi from "apis/permission";
import {
  GetPermissionsParams,
  Permission,
} from "constants/types/permission.type";
import { useEffect, useState } from "react";

type PermissionsState = {
  permissions: Array<Permission>;
  page: number;
  limit: number;
  total: number;
  isLoadingGetAllPermission: boolean;
};

const initialState: PermissionsState = {
  permissions: [],
  page: 1,
  limit: 10,
  total: 0,
  isLoadingGetAllPermission: false,
};

const useQueryPermissions = () => {
  const [permissionsState, setPermissionsState] =
    useState<PermissionsState>(initialState);

  const handleGetPermissions = async (params?: GetPermissionsParams) => {
    try {
      setPermissionsState((state) => ({
        ...state,
        isLoadingGetAllPermission: true,
      }));
      const _params = {
        ...params,
        page: params?.page ? params.page : permissionsState.page,
        limit: params?.limit ? params.limit : permissionsState.limit,
      };
      const permissionsRes = await permissionApi.getAll(_params);
      setPermissionsState((state) => ({
        ...state,
        permissions: permissionsRes.data.result.docs,
        page: permissionsRes.data.result.page,
        limit: permissionsRes.data.result.limit,
        total: permissionsRes.data.result.totalDocs,
        isLoadingGetAllPermission: false,
      }));
    } catch (error) {
      setPermissionsState((state) => ({
        ...state,
        isLoadingGetAllPermission: false,
      }));
    }
  };

  useEffect(() => {
    handleGetPermissions();
  }, []);

  return {
    permissionsState,
    handleGetPermissions,
  };
};

export default useQueryPermissions;
