import { Steps } from "antd";
import {
  SendOutlined,
  CloseCircleOutlined,
  RollbackOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { OrderLogItem } from "constants/types/order.type";
import moment from "moment";
import React, { FC } from "react";
import { OrderStatusId } from "constants/constant";

type Props = {
  data: Array<OrderLogItem>;
};

const OrderTimeLine: FC<Props> = ({ data }) => {
  const renderIcon = (status_id: string) => {
    switch (status_id) {
      case OrderStatusId.SHIPPING:
        return <SendOutlined />;
      case OrderStatusId.DELIVERIED:
        return <CheckCircleOutlined />;
      case OrderStatusId.CANCELED:
        return <CloseCircleOutlined />;
      case OrderStatusId.RETURN:
        return <RollbackOutlined />;
      default:
        return null;
    }
  };
  return (
    <div>
      <Steps labelPlacement="vertical" size="small">
        {data
          ?.slice(0)
          .reverse()
          .map((item: OrderLogItem, index: number) => (
            <Steps.Step
              key={index}
              title={item.status}
              subTitle={moment.utc(item.action_time).format("HH:mm DD/MM/yyyy")}
              status="finish"
              icon={renderIcon(item.status_id)}
            />
          ))}
      </Steps>
    </div>
  );
};

export default OrderTimeLine;
