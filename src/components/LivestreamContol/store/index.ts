import { createState } from "@hookstate/core";

export type LivestreamControlState = {
  title: string;
  link_livestream: string;
  start_time: string;
  end_time: string;
};

const initialState: LivestreamControlState = {
  title: "",
  link_livestream: "",
  start_time: "",
  end_time: "",
};

const store = createState(initialState);

export const resetState = () => {
  store.set({
    title: "",
    link_livestream: "",
    start_time: "",
    end_time: "",
  });
};

export default store;
