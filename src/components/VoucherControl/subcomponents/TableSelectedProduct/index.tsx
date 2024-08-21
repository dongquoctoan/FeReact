import { Button, Space, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import styles from "components/ModalSelectProduct/ModalSelectProduct.module.css";
import PriceText from "components/PriceText";
import { Product } from "constants/types/product.type";
import React, { useMemo } from "react";
import productUtils from "utils/product";

export type Props = {
  products: Array<Product>;
  page: number;
  total: number;
  limit: number;
  isLoadingGetAllSelectedProduct: boolean;
  handleOnPageChange: (page: number, pageSize: number) => void;
  handleDeleteSelectedProduct: (id: string) => void;
  disabled: boolean;
};

const TableSelectedProduct: React.FC<Props> = ({
  products,
  page,
  limit,
  total,
  isLoadingGetAllSelectedProduct,
  handleOnPageChange,
  handleDeleteSelectedProduct,
  disabled,
}) => {
  const columns: ColumnsType<Product> = useMemo(
    () => [
      {
        title: "Tên sản phẩm",
        key: "name",
        render: (value, item) => (
          <Space align="start">
            <div className={styles.img}>
              <img src={item.images.length > 0 ? item.images[0] : ""} alt="" />
            </div>
            <span className={styles.name}>{item.name}</span>
          </Space>
        ),
      },
      {
        title: "Giá",
        key: "price",
        render: (value, item) => {
          const originalPrices = productUtils.getOriginalPrice(item.models);

          return <PriceText prices={originalPrices} />;
        },
      },
      {
        title: "Số Lượng Hàng",
        render: (value, item) => {
          return <span>{productUtils.getTotalStock(item.models)}</span>;
        },
      },
      {
        title: "Hành động",
        key: "actions",
        render: (value, item) => (
          <Button
            size="small"
            type="link"
            danger
            onClick={() => handleDeleteSelectedProduct(item._id || "")}
          >
            {!disabled && "Xóa"}
          </Button>
        ),
      },
    ],
    [products]
  );

  return (
    <>
      {products.length > 0 && (
        <Table
          size="small"
          bordered
          loading={isLoadingGetAllSelectedProduct}
          columns={columns}
          dataSource={products}
          pagination={{
            total: total,
            pageSize: limit,
            current: page,
            hideOnSinglePage: true,
            onChange: handleOnPageChange,
          }}
        />
      )}
    </>
  );
};

export default React.memo(TableSelectedProduct);
