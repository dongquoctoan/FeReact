import { createState } from "@hookstate/core";
import { postApi } from "apis/post";
import { Post, GetPostParams } from "constants/types/post.type";

type PostListState = {
  posts: Array<Post>;
  limit: number;
  page: number;
  total: number;
  isLoading: boolean;
};

const initialState: PostListState = {
  posts: [],
  limit: 10,
  page: 1,
  total: 0,
  isLoading: true,
};

const store = createState(initialState);

export const fetchPostList = async (params?: GetPostParams) => {
  try {
    store.isLoading.set(true);
    const _params = {
      ...params,
      page: params?.page ? params.page : store.page.get(),
      limit: params?.limit ? params.limit : store.limit.get(),
    };
    const postRes = await postApi.getAll(_params);

    store.set({
      posts: postRes.data.result.docs,
      page: postRes.data.result.page,
      limit: postRes.data.result.limit,
      total: postRes.data.result.totalDocs,
      isLoading: false,
    });
  } catch (error) {
    store.isLoading.set(false);
  }
};

export default store;
