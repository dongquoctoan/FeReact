import React, { useMemo } from "react";
import Table, { ColumnsType } from "antd/lib/table";
import { Button, Popconfirm, Space } from "antd";
import moment from "moment";
import Status from "components/Status";
import { Warehouse } from "constants/types/warehouse.type";

interface DataType {
  _id: string;
  name: string;
  code: string;
  description: string;
  address_line: string;
  status: string;
  city_id: string;
  district_id: string;
  ward_id: string;
  ward: any;
  district: any;
  city: any;
  created_at: string;
  manager_name: string;
  phone: string;
}

type Props = {
  data: DataType[];
  limit: number;
  page: number;
  total: number;
  loading: boolean;
  handleChangePage: (page: number, pageSize: number) => void;
  handleDeleteWarehouse: (id: string) => void;
  handleOpenModalUpdate: (data: Warehouse) => void;
};

const WarehouseTable: React.FC<Props | any> = (props) => {
  const {
    data,
    limit,
    page,
    total,
    loading,
    handleChangePage,
    handleDeleteWarehouse,
    handleOpenModalUpdate,
  } = props;

  const columns: ColumnsType<DataType> = useMemo(
    () => [
      {
        title: "Mã kho hàng",
        dataIndex: "code",
      },
      {
        title: "Tên kho hàng",
        dataIndex: "name",
      },
      {
        title: "Quản lý",
        dataIndex: "manager_name",
      },
      {
        title: "SĐT",
        dataIndex: "phone",
      },
      {
        title: "Địa chỉ",
        dataIndex: "address",
        render: (_, record) => {
          const address = [
            record.address_line,
            record.ward?.name,
            record.district?.name,
            record.city?.name,
          ];
          return address.join(", ");
        },
      },
      {
        title: "Ngày tạo",
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
        dataIndex: "_id",
        key: "actions",
        render: (text, record) => (
          <Space direction="vertical">
            <Button
              size="small"
              type="link"
              onClick={() => handleOpenModalUpdate(record)}
            >
              Chỉnh sửa
            </Button>

            <Popconfirm
              title={"Xác nhận xóa bản ghi này?"}
              onConfirm={() => handleDeleteWarehouse(text)}
            >
              <Button size="small" type="link" danger>
                Xóa
              </Button>
            </Popconfirm>
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

export default WarehouseTable;
