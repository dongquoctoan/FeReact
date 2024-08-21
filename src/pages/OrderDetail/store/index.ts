import { createState } from "@hookstate/core";
import { message } from "antd";
import { orderApi } from "apis/order";
import { OrderDetailType } from "constants/types/order.type";

const initialState: OrderDetailType = {
  _id: "",
  unique_id: "",
  user_id: "",
  created_at: "",
  ghtk_label: "",
  items: [],
  payment_type: "",
  shipping_status: 0,
  updated_at: "",
  user_created: "",
  user_updated: "",
  users: [],
  warehouse_id: "",
  status: "WAITING_CONFIRM",
  order_logs: [],
  shipping_logs: [],
};

const store = createState(initialState);

export const getOrderDetail = async (orderId: string) => {
  try {
    const dataRes = await orderApi.getOne(orderId);
    store.set({
      ...store.value,
      ...dataRes.data.result,
    });
  } catch (error) {
    store.set(initialState);
  }
};

export const confirmOrder = async (orderId: string) => {
  try {
    await orderApi.confirmOrder(orderId);
    message.success("Xác nhận đơn hàng thành công!");
  } catch (error: any) {
    message.error(error.response.data.error.message);
  }
};

export default store;
