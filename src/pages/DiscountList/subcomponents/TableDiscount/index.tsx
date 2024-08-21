import { Avatar, Button, Popconfirm, Space, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import Status from "components/Status";
import { HAPPENING, UPCOMING } from "constants/types/common.type";
import { Discount } from "constants/types/discount.type";
import { FC, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import { EDIT_DISCOUNT } from "routes/route.constant";
import { formatDate } from "utils/date";
import { replaceParams } from "utils/route";

type Props = {
  discounts: Array<Discount>;
  loading: boolean;
  total: number;
  pageSize: number;
  current: number;
  onChangePage: (page: number, pageSize: number) => void;
  onDelete: (discountId: string) => void;
  onFinish: (discountId: string) => void;
};

const TableDiscount: FC<Props> = ({
  discounts,
  loading,
  total,
  pageSize,
  current,
  onChangePage,
  onDelete,
  onFinish,
}) => {
  const navigate = useNavigate();
  const columns: ColumnsType<any> = useMemo(
    () => [
      {
        title: "Tên chương trình",
        dataIndex: "name",
        width: 400,
      },
      {
        title: "Sản phẩm",
        dataIndex: "images",
        render: (images) => (
          <Avatar.Group maxCount={5}>
            {images.map((imageUrl: string) => (
              <Avatar src={imageUrl} key={imageUrl} shape="square" />
            ))}
          </Avatar.Group>
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        render: (status) => <Status status={status} />,
      },
      {
        title: "Thời gian",
        render: (value, discount) => (
          <Space>
            <span>{formatDate(discount.start_time)}</span>-
            <span>{formatDate(discount.end_time)}</span>
          </Space>
        ),
      },
      {
        title: "Thao tác",
        width: 150,
        render: (value, discount) => (
          <>
            <div>
              <Button
                type="link"
                size="small"
                onClick={() =>
                  navigate(replaceParams(EDIT_DISCOUNT, [discount._id]))
                }
              >
                Chi tiết
              </Button>
            </div>
            {discount.status == UPCOMING && (
              <div>
                <Popconfirm
                  title="Xóa chương trình khuyến mãi?"
                  onConfirm={() => onDelete(discount._id)}
                >
                  <Button type="link" size="small" danger>
                    Xóa
                  </Button>
                </Popconfirm>
              </div>
            )}
            {discount.status == HAPPENING && (
              <div>
                <Popconfirm
                  title="Kết thúc chương trình khuyến mãi?"
                  onConfirm={() => onFinish(discount._id)}
                >
                  <Button type="link" size="small" danger>
                    Kết thúc
                  </Button>
                </Popconfirm>
              </div>
            )}
          </>
        ),
      },
    ],
    []
  );

  return (
    <div>
      <Table
        size="small"
        bordered
        columns={columns}
        dataSource={discounts}
        pagination={{
          size: "default",
          total,
          pageSize,
          current,
          hideOnSinglePage: true,
          onChange: onChangePage,
        }}
        loading={loading}
      />
    </div>
  );
};

export default memo(TableDiscount);
