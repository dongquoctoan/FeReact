import { CommonGetAllParams } from "constants/types/common.type";

export type AffiliateStatusType = "WAITING_CONFIRM" | "CONFIRMED" | "REFUSED";

export type GetAffiliateRequestParams = CommonGetAllParams & {
  last_name?: string;
  email?: string;
  phone?: string;
  affiliate_status?: string;
};

export type AffiliateRequest = {
  _id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  status: string;
  affiliate_status: AffiliateStatusType;
  link_social_media: string;
};

export type AffiliateCollaborator = {
  _id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  status: string;
  link_social_media: string;
  affiliate_code: string;
  affiliate_product_category_id: Array<string>;
  user_updated: string;
};

export type RevenuePerMonth = {
  month_year: string;
  money: number;
};

export type PaymentHistory = {
  _id: string;
  affiliate_money_number: number;
  affiliate_money_update_time: string;
};
