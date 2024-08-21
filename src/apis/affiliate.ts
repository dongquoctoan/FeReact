import { request } from "apis/base";
import { CommonGetAllParams } from "constants/types/common.type";
import {
  AffiliateRequest,
  GetAffiliateRequestParams,
} from "constants/types/affiliateRequest.type";

export const affiliateApi = {
  getRequestList: (params?: CommonGetAllParams) => {
    return request("/admin/link-affiliate", {
      method: "GET",
      params,
    });
  },
  getRequestDetail: (affiliateRequestId: string) => {
    return request("/admin/link-affiliate/" + affiliateRequestId, {
      method: "GET",
    });
  },
  confirmRequestList: (affiliateRequestId: string) => {
    return request("/admin/link-affiliate/confirm/" + affiliateRequestId, {
      method: "PUT",
    });
  },
  refuseRequestList: (affiliateRequestId: string) => {
    return request("/admin/link-affiliate/refuse/" + affiliateRequestId, {
      method: "PUT",
    });
  },
  getCollaboratorList: (params?: CommonGetAllParams) => {
    return request("/admin/link-affiliate/collaborators", {
      method: "POST",
      params,
    });
  },
  getRevenueDetail: (affiliateCollaboratorId: string) => {
    return request(
      "/admin/affiliate-history/revenue/" + affiliateCollaboratorId,
      {
        method: "GET",
      }
    );
  },
  getPaymentHistory: (affiliateCollaboratorId: string) => {
    return request("/admin/affiliate-history/" + affiliateCollaboratorId, {
      method: "GET",
    });
  },
};
