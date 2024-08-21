import { postCategoryApi } from "apis/postCategory";
import {
  GetPostCategoriesParams,
  PostCategory,
} from "constants/types/postCategory.type";
import { useEffect, useState } from "react";

export type PostCategoriesState = {
  postCategories: Array<PostCategory>;
  page: number;
  limit: number;
  total: number;
  isLoading: boolean;
};

const initialState: PostCategoriesState = {
  postCategories: [],
  page: 1,
  limit: 10,
  total: 0,
  isLoading: false,
};

const useQueryPostCategories = () => {
  const [postCategoriesState, setPostCategoriesState] =
    useState<PostCategoriesState>(initialState);

  const handleGetPostCategories = async (
    params?: GetPostCategoriesParams
  ) => {
    try {
      setPostCategoriesState((state) => ({
        ...state,
        isLoading: true,
      }));

      const _params = {
        ...params,
        page: params?.page ? params.page : postCategoriesState.page,
        limit: params?.limit ? params.limit : postCategoriesState.limit,
      };

      const postCategoriesRes = await postCategoryApi.getAll(_params);
      setPostCategoriesState((state) => ({
        ...state,
        postCategories: postCategoriesRes.data.result.docs,
        page: postCategoriesRes.data.result.page,
        limit: postCategoriesRes.data.result.limit,
        total: postCategoriesRes.data.result.totalDocs,
        isLoading: false,
      }));
    } catch (error) {
      setPostCategoriesState((state) => ({
        ...state,
        isLoading: false,
      }));
    }
  };

  useEffect(() => {
    handleGetPostCategories();
  }, []);

  return {
    postCategoriesState,
    handleGetPostCategories,
  };
};

export default useQueryPostCategories;
