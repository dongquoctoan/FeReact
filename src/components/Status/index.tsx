import { Tag } from "antd";
import { Status as StatusType } from "constants/types/common.type";
import React, { FC } from "react";

type Props = {
  status: StatusType | string;
  activedText?: string;
  unactivedText?: string;
  lockedText?: string;
  deletedText?: string;
  upcomingText?: string;
  happeningText?: string;
  finishedText?: string;
  waitingComfirmText?: string;
  waitingShippingText?: string;
  shippingText?: string;
  cancelledText?: string;
  completeText?: string;
};

const Status: FC<Props> = ({
  status,
  activedText = "Đã kích hoạt",
  unactivedText = "Chưa kích hoạt",
  lockedText = "Đã khóa",
  deletedText = "Đã xóa",
  upcomingText = "Sắp diễn ra",
  happeningText = "Đang diễn ra",
  finishedText = "Đã kết thúc",
  waitingComfirmText = "Chờ xác nhận",
  waitingShippingText = "Chuẩn bị giao hàng",
  shippingText = "Đang giao",
  cancelledText = "Đã hủy",
  completeText = "Hoàn thành",
}) => {
  if (status === "actived") {
    return <Tag color="success">{activedText}</Tag>;
  }
  if (status === "unactive") {
    return <Tag color="default">{unactivedText}</Tag>;
  }
  if (status === "locked") {
    return <Tag color="warning">{lockedText}</Tag>;
  }
  if (status === "deleted") {
    return <Tag color="error">{deletedText}</Tag>;
  }
  if (status === "upcoming") {
    return <Tag color="warning">{upcomingText}</Tag>;
  }
  if (status === "happening") {
    return <Tag color="success">{happeningText}</Tag>;
  }
  if (status === "finished") {
    return <Tag color="error">{finishedText}</Tag>;
  }
  if (status === "WAITING_CONFIRM") {
    return <Tag color="default">{waitingComfirmText}</Tag>;
  }
  if (status === "WAITING_SHIPPING") {
    return <Tag color="warning">{waitingShippingText}</Tag>;
  }
  if (status === "CANCELED") {
    return <Tag color="error">{cancelledText}</Tag>;
  }

  return null;
};

export default Status;
