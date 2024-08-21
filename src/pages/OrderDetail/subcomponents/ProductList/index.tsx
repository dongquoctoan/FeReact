import { Card, Col, List, Row, Image } from "antd";
import React, { FC } from "react";
import styles from "pages/OrderDetail/OrderDetail.module.css";
import PriceText from "components/PriceText";
import { ProductItem } from "constants/types/order.type";

type Props = {
  data: Array<ProductItem>;
};

const ProductList: FC<Props> = ({ data }) => {
  return (
    <Card title="Sản phẩm" style={{ marginTop: 8 }} bordered={false}>
      <List>
        {data.map((item: any) => (
          <List.Item key={item._id}>
            <Row wrap={false} gutter={8} style={{ width: "100%" }}>
              <Col>
                <Image className={styles.img} src={item.product.images[0]} />
              </Col>
              <Col flex={1}>
                <div className={styles.productName}>{item.product.name}</div>
                <Row justify="space-between">
                  {item.name ? <Col>Phân loại hàng: {item.name}</Col> : <Col />}

                  <Col>x{item.quantity}</Col>
                </Row>
                <PriceText
                  className={styles.price}
                  type="basic"
                  prices={[item.price]}
                />
              </Col>
            </Row>
          </List.Item>
        ))}
      </List>
    </Card>
  );
};

export default ProductList;
