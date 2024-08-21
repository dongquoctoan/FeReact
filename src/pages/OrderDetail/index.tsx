import React, { FC, useEffect, useState } from "react";
import { useHookstate } from "@hookstate/core";
import store, { confirmOrder, getOrderDetail } from "pages/OrderDetail/store";
import { useParams, useNavigate } from "react-router-dom";
import { OrderDetailType } from "constants/types/order.type";
import { OrderStatus } from "constants/constant";
import ProductList from "pages/OrderDetail/subcomponents/ProductList";
import PriceInfo from "pages/OrderDetail/subcomponents/PriceInfo";
import { Affix, Button, Card, message, Space } from "antd";
import styles from "pages/OrderDetail/OrderDetail.module.css";
import { orderApi } from "apis/order";
import ShippingTimeLine from "pages/OrderDetail/subcomponents/ShippingTimeLine";
import OrderTimeLine from "./subcomponents/OrderTimeLine";

const OrderDetail: FC = () => {
  const navigate = useNavigate();
  const orderState = useHookstate(store);
  const { id } = useParams();
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const order: OrderDetailType = orderState.get();

  useEffect(() => {
    if (id) {
      getOrderDetail(id);
    }
  }, [id]);

  const handleConfirmOrder = async () => {
    if (id) {
      await confirmOrder(id);
      await getOrderDetail(id);
    }
  };

  const handlePrintDelivery = async () => {
    try {
      const res = await orderApi.printDelivery(order.ghtk_label);

      const file = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.target = "_blank";
      a.href = url;
      a.click();
      a.remove();
    } catch (error: any) {
      setIsDownloading(false);
      const dataError = JSON.parse(
        new TextDecoder().decode(error.response.data as ArrayBuffer)
      );
      message.error(dataError.error.message);
    }
  };

  return (
    <div>
      <Card
        title={
          <div className={styles.orderTitle}>
            <span style={{ marginRight: "0.5rem" }}>
              MÃ ĐƠN HÀNG: {order.unique_id}
            </span>
            {" | "}
            <span className={styles.orderStatus}>
              {OrderStatus[order.status].toUpperCase()}
            </span>
          </div>
        }
      >
        <OrderTimeLine data={order.order_logs} />
      </Card>
      {!order.delivery_address ? null : (
        <Card
          title={
            <div className={styles.shippingTitle}>
              <span>Địa chỉ nhận hàng</span>
              <div className={styles.subtitle}>
                <div>Giao hàng tiết kiệm</div>
                <div>{order.ghtk_label}</div>
              </div>
            </div>
          }
        >
          <div className={styles.shippingWrapper}>
            <div className={styles.shippingInfoBox}>
              <div>{order.delivery_address.name}</div>
              <div className={styles.subtitle}>
                {order.delivery_address.phone}
              </div>
              <div className={styles.subtitle}>
                {[
                  order.delivery_address.address_line,
                  order.delivery_address.ward.name,
                  order.delivery_address.district.name,
                  order.delivery_address.city.name,
                ].join(", ")}
              </div>
            </div>
            <div className={styles.shippingStatusBox}>
              <ShippingTimeLine data={order.shipping_logs} />
            </div>
          </div>
        </Card>
      )}

      <ProductList data={order.items} />

      <PriceInfo />

      <Affix offsetBottom={0}>
        <Card style={{ marginTop: 16 }}>
          <Space>
            <Button onClick={() => navigate(-1)}>Trở lại</Button>
            {order.ghtk_label ? (
              <Button
                type="primary"
                loading={isDownloading}
                onClick={handlePrintDelivery}
              >
                In vận đơn
              </Button>
            ) : null}
            {order.status === "WAITING_CONFIRM" ? (
              <Button type="primary" onClick={handleConfirmOrder}>
                Xác nhận
              </Button>
            ) : null}
          </Space>
        </Card>
      </Affix>
    </div>
  );
};

export default OrderDetail;
