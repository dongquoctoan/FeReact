import React, { useMemo } from "react";
import Table, { ColumnsType } from "antd/lib/table";
import { Button, Popconfirm, Space } from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { EDIT_VOUCHER } from "routes/route.constant";
import { replaceParams } from "utils/route";
import Status from "components/Status";
import {
  FINISHED_STATUS,
  HAPPENING_STATUS,
  VOUCHER_ALL_PRODUCT_TYPE,
} from "constants/Voucher/voucherType";

interface DataType {
  _id: string;
  name: string;
  code: string;
  start_time: string;
  end_time: string;
  discount_percent: number;
  discount_amount: number;
  minimum_order_apply: number;
  total: number;
  current_usage: number;
  status: string;
}

type Props = {
  data: DataType[];
  limit: number;
  page: number;
  total: number;
  loading: boolean;
  handleChangePage: (page: number, pageSize: number) => void;
  handleDeleteVoucher: (id: string) => void;
  handleFinishVoucher: (id: string) => void;
};

const VoucherTable: React.FC<Props> = (props) => {
  const navigate = useNavigate();

  const {
    data,
    limit,
    page,
    total,
    loading,
    handleChangePage,
    handleDeleteVoucher,
    handleFinishVoucher,
  } = props;

  const columns: ColumnsType<DataType> = useMemo(
    () => [
      {
        title: "Tên chương trình",
        dataIndex: "name",
      },
      {
        title: "Mã voucher",
        dataIndex: "code",
      },
      {
        title: "Loại mã",
        key: "type",
        render: (text) => {
          if (text.type === VOUCHER_ALL_PRODUCT_TYPE) {
            return (
              <div>
                <span> Mã giảm giá toàn Shop</span>
                <span
                  style={{
                    color: "gray",
                    fontSize: 12,
                    display: "block",
                  }}
                >
                  (Tất cả sản phẩm)
                </span>
              </div>
            );
          } else
            return (
              <div>
                <span>Mã giảm giá sản phẩm</span>
                <span
                  style={{
                    color: "gray",
                    fontSize: 12,
                    display: "block",
                  }}
                >
                  (Chỉ giảm giá các sản phẩm được chọn trong shop)
                </span>
              </div>
            );
        },
      },
      {
        title: "Thời gian sử dụng",
        key: "time",
        render: (_, record) => (
          <span>
            {moment(record.start_time).format("HH:mm DD/MM/yyyy")}{" "}
            <span style={{ color: "gray", fontSize: 12 }}>đến</span>{" "}
            {moment(record.end_time).format("HH:mm DD/MM/yyyy")}
          </span>
        ),
      },
      {
        title: "Số lượng",
        dataIndex: "usage_quantity",
      },
      {
        title: "Đã dùng",
        dataIndex: "current_usage",
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        render: (status) => <Status status={status} />,
      },
      {
        title: "Thao tác",
        dataIndex: "_id",
        key: "actions",
        render: (text, record) => (
          <Space direction="vertical">
            <Button
              size="small"
              type="link"
              onClick={() =>
                navigate(replaceParams(EDIT_VOUCHER, [record._id]))
              }
            >
              {record.status !== FINISHED_STATUS ? "Chỉnh sửa" : "Xem chi tiết"}
            </Button>
            {record.status !== FINISHED_STATUS ? (
              <Popconfirm
                title={
                  record.status === HAPPENING_STATUS
                    ? "Xác nhận kết thúc mã giảm giá này?"
                    : "Xác nhận xóa mã giảm giá này?"
                }
                onConfirm={() =>
                  record.status === HAPPENING_STATUS
                    ? handleFinishVoucher(text)
                    : handleDeleteVoucher(text)
                }
              >
                <Button size="small" type="link" danger>
                  {record.status === HAPPENING_STATUS ? "Kết thúc" : "Xóa"}
                </Button>
              </Popconfirm>
            ) : null}
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

export default VoucherTable;
