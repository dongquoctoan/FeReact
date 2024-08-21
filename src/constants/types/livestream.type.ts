import { PromotionStatus } from "constants/types/common.type";

export type LiveStream = {
  _id: string;
  title: string;
  link_livestream: string;
  start_time: string;
  end_time: string;
  status: PromotionStatus;
  user_created: string;
  user_updated: string;
  created_at: string;
  updated_at: string;
};

export type NewLiveStreamSession = {
  title: string;
  link_livestream: string;
  start_time: string;
  end_time: string;
};
