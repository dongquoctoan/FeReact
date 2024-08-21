import React, { FC } from "react";
import { Timeline, Space } from "antd";
import { ShippingLogItem } from "constants/types/order.type";
import moment from "moment";
import styles from "pages/OrderDetail/subcomponents/ShippingTimeLine/ShippingTimeLine.module.css";

type Props = {
  data: Array<ShippingLogItem>;
};

const ShippingTimeLine: FC<Props> = ({ data }) => {
  return (
    <>
      <Timeline reverse={true}>
        {data.map((item: ShippingLogItem, index: number) => (
          <Timeline.Item
            key={index}
            color={index === data.length - 1 ? "green" : "blue"}
          >
            <Space align="start">
              <p>{moment.utc(item.action_time).format("HH:mm DD-MM-yyyy")}</p>
              <Space direction="vertical" size={2}>
                <p className={item.reason ? styles.bold : ""}>{item.status}</p>
                <p className={styles.subTitle}>{item.reason}</p>
              </Space>
            </Space>
          </Timeline.Item>
        ))}
      </Timeline>
    </>
  );
};

export default ShippingTimeLine;
