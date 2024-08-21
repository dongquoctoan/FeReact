import { Button, Popconfirm, Space, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import Status from "components/Status";
import { UPCOMING } from "constants/types/common.type";
import { FC, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "utils/date";
import { replaceParams } from "utils/route";
import { LiveStream } from "constants/types/livestream.type";
import { EDIT_LIVESTREAM } from "routes/route.constant";

type Props = {
  livestreamList: Array<LiveStream>;
  loading: boolean;
  total: number;
  pageSize: number;
  current: number;
  onChangePage: (page: number, pageSize: number) => void;
  onDelete: (flashSaleId: string) => void;
};

const TableLivestream: FC<Props> = ({
  livestreamList,
  loading,
  total,
  pageSize,
  current,
  onChangePage,
  onDelete,
}) => {
  const navigate = useNavigate();
  const columns: ColumnsType<any> = useMemo(
    () => [
      {
        title: "Tiêu đề",
        dataIndex: "title",
        width: 400,
      },
      {
        title: "Đường dẫn",
        dataIndex: "link_livestream",
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        render: (status) => <Status status={status} />,
      },
      {
        title: "Thời gian",
        render: (value, livestream) => (
          <Space>
            <span>{formatDate(livestream.start_time)}</span>-
            <span>{formatDate(livestream.end_time)}</span>
          </Space>
        ),
      },
      {
        title: "Thao tác",
        width: 150,
        render: (value, livestream) => (
          <>
            <div>
              <Button
                type="link"
                size="small"
                onClick={() =>
                  navigate(replaceParams(EDIT_LIVESTREAM, [livestream._id]))
                }
              >
                Chi tiết
              </Button>
            </div>
            {livestream.status == UPCOMING && (
              <div>
                <Popconfirm
                  title="Xóa phiên livestream?"
                  onConfirm={() => onDelete(livestream._id)}
                >
                  <Button type="link" size="small" danger>
                    Xóa
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
        dataSource={livestreamList}
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

export default memo(TableLivestream);
