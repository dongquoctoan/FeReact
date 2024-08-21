import { Avatar, Button, Popconfirm, Space, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import Status from "components/Status";
import { RootState } from "configs/configureStore";
import { ProductCategory } from "constants/types/productCategory.type";
import { ProductCategoriesState } from "pages/ProductCategories/hooks/useQueryProductCategories";
import React, { FC, useMemo } from "react";
import { useSelector } from "react-redux";
import { formatDate } from "utils/date";
import { useNavigate } from "react-router-dom";
import { PRODUCT_ATTRIBUTE } from "routes/route.constant";
import { replaceParams } from "utils/route";

type Props = {
  productCategoriesState: ProductCategoriesState;
  onChangePage: (page: number, pageSize: number) => void;
  onConfirmDeleteProdCategory: (productCategoryId: string) => void;
  onClickEditProdCategory: (productCategory: ProductCategory) => void;
};

const TableProductCategory: FC<Props> = ({
  productCategoriesState,
  onChangePage,
  onConfirmDeleteProdCategory,
  onClickEditProdCategory,
}) => {
  const { productCategoriesSelection } = useSelector(
    (state: RootState) => state.appSlice
  );
  const navigate = useNavigate();

  const columns: ColumnsType<any> = useMemo(
    () => [
      {
        title: "Tên danh mục",
        render: (_, productCategory: ProductCategory) => (
          <Space>
            <Avatar size="large" shape="square" src={productCategory.image} />
            <div>{productCategory.name}</div>
          </Space>
        ),
      },
      {
        title: "Mô tả",
        dataIndex: "description",
      },
      {
        title: "Danh mục cha",
        dataIndex: "parent_category_path",
        render: (parentCategoryPath: Array<string>) => {
          const parentCategories = parentCategoryPath.map(
            (categoryId) =>
              productCategoriesSelection.find(
                (productCategorySelection) =>
                  productCategorySelection.value === categoryId
              )?.label
          );
          return <span>{parentCategories.join(" > ")}</span>;
        },
      },
      {
        title: "Hoa hồng",
        dataIndex: "affiliate_percent_collaborator",
        render: (value) => (value ? value + "%" : ""),
      },
      {
        title: "Giảm giá",
        dataIndex: "affiliate_percent_customer",
        render: (value) => (value ? value + "%" : ""),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        render: (status) => <Status status={status} />,
      },
      {
        title: "Ngày tạo",
        dataIndex: "created_at",
        render: (created_at) => <span>{formatDate(created_at)}</span>,
      },
      {
        title: "Thao tác",
        render: (_, productCategory: ProductCategory) => (
          <>
            <Space direction="vertical">
              <Button
                size="small"
                type="link"
                onClick={() =>
                  navigate(
                    replaceParams(PRODUCT_ATTRIBUTE, [productCategory._id])
                  )
                }
              >
                Thuộc tính sản phẩm
              </Button>
              {productCategory.status != "deleted" && (
                <>
                  <Button
                    type="link"
                    size="small"
                    onClick={() => onClickEditProdCategory(productCategory)}
                  >
                    Chỉnh sửa
                  </Button>
                  <Popconfirm
                    title="Xóa danh mục này?"
                    onConfirm={() =>
                      onConfirmDeleteProdCategory(productCategory._id)
                    }
                  >
                    <Button type="link" size="small" danger>
                      Xóa
                    </Button>
                  </Popconfirm>
                </>
              )}
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
        dataSource={productCategoriesState.productCategories}
        pagination={{
          size: "default",
          pageSize: productCategoriesState.limit,
          current: productCategoriesState.page,
          total: productCategoriesState.total,
          hideOnSinglePage: true,
          onChange: onChangePage,
        }}
        loading={productCategoriesState.isLoadingGetAllProductCategory}
        rowKey={(row) => row._id}
      />
    </div>
  );
};

export default TableProductCategory;
