import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Space, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { productApi } from "apis/product";
import styles from "components/ModalSelectProduct/ModalSelectProduct.module.css";
import PriceText from "components/PriceText";
import { GetProductsParams, Product } from "constants/types/product.type";
import { useFormik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import productUtils from "utils/product";

type ModalSelectProductState = {
  products: Array<Product>;
  page: number;
  limit: number;
  total: number;
  isLoadingGetAllProduct: boolean;
};

const initialSelectProducts: ModalSelectProductState = {
  products: [],
  page: 1,
  limit: 10,
  total: 0,
  isLoadingGetAllProduct: false,
};

type Props = {
  visible: boolean;
  onCancel: () => void;
  onOk: (productIds: Array<string>) => void;
  productIds: Array<string>;
  disabledProductIds?: Array<string>;
};

const ModalSelectProduct: React.FC<Props> = ({
  visible,
  productIds,
  onCancel,
  onOk,
  disabledProductIds,
}) => {
  const [selectProductsState, setSelectProductsState] =
    useState<ModalSelectProductState>(initialSelectProducts);

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    productIds || []
  );

  const handleGetSelectProducts = async (params?: GetProductsParams) => {
    try {
      setSelectProductsState((state) => ({
        ...state,
        isLoadingGetAllProduct: true,
      }));
      const _params = {
        ...params,
        page: params?.page ? params.page : selectProductsState.page,
        limit: params?.limit ? params.limit : selectProductsState.limit,
      };

      const productsRes = await productApi.getAll(_params);
      setSelectProductsState((state) => ({
        ...state,
        products: productsRes.data.result.docs,
        page: productsRes.data.result.page,
        limit: productsRes.data.result.limit,
        total: productsRes.data.result.totalDocs,
        isLoadingGetAllProduct: false,
      }));
    } catch (error) {
      setSelectProductsState((state) => ({
        ...state,
        isLoadingGetAllProduct: false,
      }));
    }
  };

  useEffect(() => {
    handleGetSelectProducts();
  }, []);

  useEffect(() => {
    setSelectedProductIds([...(productIds || [])]);
  }, [productIds]);

  const formFilter = useFormik({
    initialValues: {
      name: "",
      sku: "",
      category_id: "",
    },
    onSubmit: (data) => {
      handleGetSelectProducts(data);
    },
  });

  const handleChangePage = (page: number, pageSize: number) => {
    const params = {
      ...(formFilter.values as any),
      page,
      limit: pageSize,
    };
    handleGetSelectProducts(params);
  };

  const handleOkSelectProducts = () => {
    onOk([...selectedProductIds]);
  };

  const onSelectChange = (newSelectedProductIds: Array<any>) => {
    setSelectedProductIds(newSelectedProductIds);
  };

  const columns: ColumnsType<Product> = useMemo(
    () => [
      {
        title: "Tên sản phẩm",
        key: "name",
        render: (value, item) => (
          <Space align="start">
            <div className={styles.img}>
              <img
                src={item.images.length > 0 ? item.images[0] : ""}
                alt={item.name}
              />
            </div>
            <div>
              <span className={styles.name}>{item.name}</span>
              <div>
                <span className={styles.productCode}>Mã: 21802911892</span>
              </div>
            </div>
          </Space>
        ),
      },
      {
        title: "SKU sản phẩm",
        dataIndex: "parent_sku",
      },
      {
        title: "Giá",
        key: "price",
        render: (value, item) => {
          const prices = productUtils.getPrices(item.models).currentPrices;

          return <PriceText prices={prices} />;
        },
      },
      {
        title: "Kho hàng",
        render: (value, item) => {
          return <span>{productUtils.getTotalStock(item.models)}</span>;
        },
      },
    ],
    [selectedProductIds]
  );

  return (
    <Modal
      title="Lựa chọn sản phẩm"
      visible={visible}
      onOk={handleOkSelectProducts}
      onCancel={onCancel}
      width={950}
      okText="Xác nhận"
    >
      <div>
        <div className={styles.filter}>
          <Space>
            <Input
              suffix={<SearchOutlined />}
              placeholder="Tên sản phẩm"
              allowClear
              name="name"
              value={formFilter.values.name}
              onChange={formFilter.handleChange}
            />
            <Input
              suffix={<SearchOutlined />}
              placeholder="SKU sản phẩm"
              allowClear
              name="sku"
              value={formFilter.values.sku}
              onChange={formFilter.handleChange}
            />
            <Button type="primary" onClick={formFilter.submitForm}>
              Tìm kiếm
            </Button>
          </Space>
        </div>
        <div>
          <Table
            rowSelection={{
              type: "checkbox",
              selectedRowKeys: selectedProductIds,
              onChange: onSelectChange,
              preserveSelectedRowKeys: true,
              getCheckboxProps: (record) => {
                let disabled = false;
                if (
                  disabledProductIds &&
                  disabledProductIds.includes(record._id)
                ) {
                  disabled = true;
                }
                return {
                  disabled,
                };
              },
            }}
            size="small"
            bordered
            columns={columns}
            dataSource={selectProductsState.products}
            rowKey={(product) => product._id}
            pagination={{
              size: "default",
              total: selectProductsState.total,
              pageSize: selectProductsState.limit,
              current: selectProductsState.page,
              hideOnSinglePage: true,
              onChange: handleChangePage,
            }}
            loading={selectProductsState.isLoadingGetAllProduct}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalSelectProduct;
