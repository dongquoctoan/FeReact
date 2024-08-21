import { Post } from "constants/types/post.type";
import { Button, Popconfirm, Space, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { FC, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "utils/date";
import { EDIT_POST } from "routes/route.constant";
import { replaceParams } from "utils/route";

type Props = {
  posts: Array<Post>;
  loading: boolean;
  total: number;
  pageSize: number;
  current: number;
  onChangePage: (page: number, pageSize: number) => void;
  onDelete: (flashSaleId: string) => void;
};

const TableFlashSale: FC<Props> = ({
  posts,
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
        render: (text) => {
          return <div style={{ fontWeight: "500" }}>{text}</div>;
        },
      },
      {
        title: "Nội dung tóm tắt",
        dataIndex: "description",
        render: (text) => {
          return (
            <div
              style={{
                maxWidth: "500px",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {text}
            </div>
          );
        },
      },
      {
        title: "Danh mục",
        dataIndex: "post_category_docs",
        render: (categories) =>
          categories?.map((item: any) => item.name).join(", "),
      },
      {
        title: "Ngày tạo",
        dataIndex: "created_at",
        render: (created_at) => <span>{formatDate(created_at)}</span>,
      },
      {
        title: "Thao tác",
        width: 150,
        render: (_, record) => (
          <Space direction="vertical" size={0}>
            <Button
              type="link"
              size="small"
              onClick={() => navigate(EDIT_POST.replace(":postId", record._id))}
            >
              Chi tiết
            </Button>

            <Popconfirm
              title="Xóa chương trình flash sale?"
              onConfirm={() => onDelete(record._id)}
            >
              <Button type="link" size="small" danger>
                Xóa
              </Button>
            </Popconfirm>
          </Space>
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
        dataSource={posts}
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
