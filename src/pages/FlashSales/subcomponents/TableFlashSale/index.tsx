import { Avatar, Button, Popconfirm, Space, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import Status from "components/Status";
import { HAPPENING, UPCOMING } from "constants/types/common.type";
import { FlashSale } from "constants/types/flashsale.type";
import { FC, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "utils/date";
import { EDIT_FLASH_SALE } from "routes/route.constant";
import { replaceParams } from "utils/route";

type Props = {
  flashSales: Array<FlashSale>;
  loading: boolean;
  total: number;
  pageSize: number;
  current: number;
  onChangePage: (page: number, pageSize: number) => void;
  onDelete: (flashSaleId: string) => void;
  onFinish: (flashSaleId: string) => void;
};

const TableFlashSale: FC<Props> = ({
  flashSales,
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
              <Avatar gap={8} src={imageUrl} key={imageUrl} shape="square" />
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
        render: (value, flashSale) => (
          <Space>
            <span>{formatDate(flashSale.start_time)}</span>-
            <span>{formatDate(flashSale.end_time)}</span>
          </Space>
        ),
      },
      {
        title: "Thao tác",
        width: 150,
        render: (value, flashSale) => (
          <>
            <div>
              <Button
                type="link"
                size="small"
                onClick={() =>
                  navigate(replaceParams(EDIT_FLASH_SALE, [flashSale._id]))
                }
              >
                Chi tiết
              </Button>
            </div>
            {flashSale.status == UPCOMING && (
              <div>
                <Popconfirm
                  title="Xóa chương trình flash sale?"
                  onConfirm={() => onDelete(flashSale._id)}
                >
                  <Button type="link" size="small" danger>
                    Xóa
                  </Button>
                </Popconfirm>
              </div>
            )}
            {flashSale.status == HAPPENING && (
              <div>
                <Popconfirm
                  title="Kết thúc chương trình flash sale?"
                  onConfirm={() => onFinish(flashSale._id)}
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
        dataSource={flashSales}
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

export default memo(TableFlashSale);
