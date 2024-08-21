import { request } from "apis/base";

export const addressApi = {
  getCitySelection: () => {
    return request("/city/selection", {
      method: "GET",
    });
  },
  getDistrictSelection: (city_id: string) => {
    return request(`/district/selection/${city_id}`, {
      method: "GET",
    });
  },
  getWardSelection: (district_id: string) => {
    return request(`/ward/selection/${district_id}`, {
      method: "GET",
    });
  },
};
