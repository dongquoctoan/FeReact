import { request } from "apis/base";
import { CommonGetAllParams } from "constants/types/common.type";
import { NewLiveStreamSession } from "constants/types/livestream.type";

const livestreamApi = {
  getAll: (params?: CommonGetAllParams) => {
    return request("/admin/livestream", {
      method: "GET",
      params,
    });
  },

  getDetail: (livestreamId: string) => {
    return request(`/admin/livestream/${livestreamId}`, {
      method: "GET",
    });
  },

  create: (data: NewLiveStreamSession) => {
    return request("/admin/livestream", {
      method: "POST",
      data,
    });
  },

  update: (livestreamId: string, data: NewLiveStreamSession) => {
    return request("/admin/livestream/" + livestreamId, {
      method: "PUT",
      data,
    });
  },

  delete: (livestreamId: string) => {
    return request(`/admin/livestream/${livestreamId}`, {
      method: "DELETE",
    });
  },
};

export default livestreamApi;
