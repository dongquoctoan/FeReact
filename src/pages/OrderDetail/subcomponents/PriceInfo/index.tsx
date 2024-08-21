import { Card, Col, Divider, Row, Space } from "antd";
import React, { FC } from "react";
import styles from "pages/OrderDetail/OrderDetail.module.css";
import PriceText from "components/PriceText";
import { useHookstate } from "@hookstate/core";
import store from "pages/OrderDetail/store";

const PriceInfo: FC = () => {
  const checkoutPriceDataState = useHookstate(store.checkout_price_data);

  const checkoutPriceData: any = checkoutPriceDataState.value;

  if (!checkoutPriceDataState) return null;

  return (
    <Card className={styles.wrapper}>
      <Space direction="vertical" style={{ width: "100%", textAlign: "end" }}>
        <Row justify="end">
          <Col span={3}>Tổng tiền hàng</Col>
          <Col span={4}>
            <PriceText
              className={styles.money}
              type="basic"
              prices={[checkoutPriceData?.merchandise_subtotal.toString()]}
            />
          </Col>
        </Row>
        <Row justify="end">
          <Col span={3}>Phí vận chuyển</Col>
          <Col span={4}>
            <PriceText
              className={styles.money}
              type="basic"
              prices={[checkoutPriceData?.shipping_subtotal]}
            />
          </Col>
        </Row>
        <Row justify="end">
          <Col span={3}>Khuyến mãi</Col>
          <Col span={4}>
            <PriceText
              className={styles.money}
              type="basic"
              prices={[-checkoutPriceData?.price_discount]}
            />
          </Col>
        </Row>
        <Row justify="end">
          <Col span={3}>Dùng ShopMusic Xu</Col>
          <Col span={4}>
            <PriceText className={styles.money} type="basic" prices={[0]} />
          </Col>
        </Row>
        <Row justify="end" align="middle">
          <Col span={3}>Tổng thanh toán</Col>
          <Col span={4}>
            <div className={styles.money}>
              <PriceText
                className={styles.totalPayment}
                prices={[checkoutPriceData?.total_payable]}
              />
            </div>
          </Col>
        </Row>
      </Space>
      <Divider dashed />
      <Row justify="end" align="middle">
        <Col span={3} style={{ textAlign: "end" }}>
          Phương thức thanh toán
        </Col>
        <Col span={4}>
          <div className={styles.paymentType}>Thanh toán khi nhận hàng</div>
        </Col>
      </Row>
    </Card>
  );
};

export default PriceInfo;
