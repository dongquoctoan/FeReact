import { userApi } from "apis/user";
import { GetUsersParams, User } from "constants/types/user.type";
import { useEffect, useState } from "react";

export type UsersState = {
  users: Array<User>;
  page: number;
  limit: number;
  total: number;
  isloadingGetAllUser: boolean;
};

const initialState: UsersState = {
  users: [],
  page: 1,
  limit: 10,
  total: 0,
  isloadingGetAllUser: false,
};

const useQueryUsers = () => {
  const [usersState, setUsersState] = useState<UsersState>(initialState);

  const handleGetUsers = async (params?: GetUsersParams) => {
    try {
      setUsersState((state) => ({ ...state, isloadingGetAllUser: true }));
      const _params = {
        ...params,
        page: params?.page ? params.page : usersState.page,
        limit: params?.limit ? params.limit : usersState.limit,
      };

      const usersRes = await userApi.getAll(_params);
      setUsersState((state) => ({
        ...state,
        users: usersRes.data.result.docs,
        page: usersRes.data.result.page,
        limit: usersRes.data.result.limit,
        total: usersRes.data.result.totalDocs,
        isloadingGetAllUser: false,
      }));
    } catch (error) {
      setUsersState((state) => ({ ...state, isloadingGetAllUser: false }));
    }
  };

  useEffect(() => {
    handleGetUsers();
  }, []);

  return {
    usersState,
    handleGetUsers,
  };
};

export default useQueryUsers;
