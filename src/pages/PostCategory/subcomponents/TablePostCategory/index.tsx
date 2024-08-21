import { Button, Popconfirm, Space, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { PostCategory } from "constants/types/postCategory.type";
import { PostCategoriesState } from "pages/PostCategory/hooks/useQueryPostCategories";
import React, { FC, useMemo } from "react";
import { formatDate } from "utils/date";

type Props = {
  postCategoriesState: PostCategoriesState;
  onChangePage: (page: number, pageSize: number) => void;
  onConfirmDeletePostCategory: (postCategoryId: string) => void;
  onClickEditPostCategory: (postCategory: PostCategory) => void;
};

const TablePostCategory: FC<Props> = ({
  postCategoriesState,
  onChangePage,
  onConfirmDeletePostCategory,
  onClickEditPostCategory,
}) => {
  const columns: ColumnsType<any> = useMemo(
    () => [
      {
        title: "Tên danh mục",
        dataIndex: "name",
      },
      {
        title: "Mô tả",
        dataIndex: "description",
      },
      {
        title: "Ngày tạo",
        dataIndex: "created_at",
        render: (created_at) => <span>{formatDate(created_at)}</span>,
      },
      {
        title: "Thao tác",
        render: (_, postCategory: PostCategory) => (
          <>
            <Space direction="vertical" size={0}>
              <Button
                type="link"
                size="small"
                onClick={() => onClickEditPostCategory(postCategory)}
              >
                Chỉnh sửa
              </Button>
              <Popconfirm
                title="Xóa danh mục này?"
                onConfirm={() => onConfirmDeletePostCategory(postCategory._id)}
              >
                <Button type="link" size="small" danger>
                  Xóa
                </Button>
              </Popconfirm>
            </Space>
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
        dataSource={postCategoriesState.postCategories}
        pagination={{
          size: "default",
          pageSize: postCategoriesState.limit,
          current: postCategoriesState.page,
          total: postCategoriesState.total,
          hideOnSinglePage: true,
          onChange: onChangePage,
        }}
        loading={postCategoriesState.isLoading}
        rowKey={(row) => row._id}
      />
    </div>
  );
};

export default TablePostCategory;
