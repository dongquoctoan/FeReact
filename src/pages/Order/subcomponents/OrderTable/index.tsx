import React, { useMemo } from "react";
import Table, { ColumnsType } from "antd/lib/table";
import { Button, Popconfirm, Space } from "antd";
import moment from "moment";
import Status from "components/Status";
import { Order } from "constants/types/order.type";
import { formatNumber } from "utils/number";
import { useNavigate } from "react-router-dom";
import { ORDER_DETAIL } from "routes/route.constant";

type Props = {
  data: Array<Order>;
  limit: number;
  page: number;
  total: number;
  loading: boolean;
  handleChangePage: (page: number, pageSize: number) => void;
  handleCancelOrder: (id: string) => void;
};

const OrderTable: React.FC<Props | any> = (props) => {
  const navigate = useNavigate();
  const {
    data,
    limit,
    page,
    total,
    loading,
    handleChangePage,
    handleCancelOrder,
  } = props;

  const columns: ColumnsType<Order> = useMemo(
    () => [
      {
        title: "Tên khách hàng",
        dataIndex: "name",
        render: (_, record) => {
          const name = record.delivery_address.name;
          return name;
        },
      },
      {
        title: "Địa chỉ",
        dataIndex: "address",
        render: (_, record) => {
          const address = [
            record.delivery_address.address_line,
            record.delivery_address.ward.name,
            record.delivery_address.district.name,
            record.delivery_address.city.name,
          ];
          return address.join(", ");
        },
      },
      {
        title: "Số điện thoại",
        dataIndex: "phoneNumber",
        render: (_, record) => {
          const phoneNumber = record.delivery_address.phone;
          return phoneNumber;
        },
      },
      {
        title: "Tổng tiền",
        dataIndex: "total",
        render: (_, record) => {
          const total = record.checkout_price_data.total_payable;
          return <span>{formatNumber(total)} đ</span>;
        },
      },
      {
        title: "Ngày đặt hàng",
        dataIndex: "created_at",
        render: (text) => moment.utc(text).format("DD/MM/yyyy"),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        render: (status) => <Status status={status} />,
      },
      {
        title: "Thao tác",
        key: "actions",
        render: (_, record) => (
          <Space direction="vertical">
            <Button
              size="small"
              type="link"
              onClick={() => navigate(ORDER_DETAIL.replace(":id", record._id))}
            >
              Chi tiết
            </Button>
            {record.status === "WAITING_CONFIRM" ? (
              <Popconfirm
                title={"Xác nhận hủy đơn hàng này?"}
                onConfirm={() => {
                  handleCancelOrder(record._id);
                }}
              >
                <Button size="small" type="link" danger>
                  Hủy
                </Button>
              </Popconfirm>
            ) : (
              <></>
            )}
          </Space>
        ),
      },
    ],
    [data]
  );

  return (
    <div>
      <Table
        size="small"
        bordered
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          pageSize: limit,
          current: page,
          hideOnSinglePage: true,
          onChange: handleChangePage,
          total: total,
        }}
      />
    </div>
  );
};

export default OrderTable;
