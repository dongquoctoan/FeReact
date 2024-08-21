import {
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useHookstate } from "@hookstate/core";
import {
  Badge,
  Button,
  Card,
  Input,
  message,
  Popconfirm,
  Popover,
  Row,
  Space,
  Table,
  Tabs,
  Tag,
} from "antd";
import { ColumnsType } from "antd/lib/table";
import { productApi } from "apis/product";
import CardTitle from "components/CardTitle";
import InputSelectProductCategory from "components/InputSelectProductCategory";
import Status from "components/Status";
import { Status as StatusType } from "constants/types/common.type";
import {
  Product,
  ProductInventory,
  ProductModel,
} from "constants/types/product.type";
import { useFormik } from "formik";
import { isEmpty } from "lodash";
import styles from "pages/Products/Products.module.css";
import productsStore, { fetchProductList } from "pages/Products/store";
import { FC, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ADD_NEW_PRODUCT, EDIT_PRODUCT } from "routes/route.constant";
import { formatDate } from "utils/date";
import { formatNumber } from "utils/number";
import { replaceParams } from "utils/route";

const handleFormatDataSourceProducts = (products: Array<Product>) => {
  return products.map((product) => {
    if (isEmpty(product.variations)) {
      return {
        ...product,
        is_parent: true,
      };
    } else {
      return {
        ...product,
        is_parent: true,
        children: product.models.map((model) => ({ ...model, isModel: true })),
      };
    }
  });
};

const Products: FC = () => {
  const navigate = useNavigate();
  const productsState = useHookstate(productsStore);

  useEffect(() => {
    fetchProductList();
  }, []);

  const formFilter = useFormik({
    initialValues: {
      name: "",
      sku: "",
      status: "",
      categoryIds: [] as Array<string>,
    },
    onSubmit: (data) => {
      const { name, sku, categoryIds, status } = data;
      const categoryId = categoryIds[categoryIds.length - 1];
      fetchProductList({
        name,
        sku,
        status,
        product_category_id: categoryId,
      });
    },
  });

  const handleChangePage = (page: number, pageSize: number) => {
    const params = {
      ...(formFilter.values as any),
      page,
      limit: pageSize,
    };
    fetchProductList(params);
  };

  const changeFilterStatus = (status: string) => {
    const params: any = {
      ...formFilter.values,
      status,
    };
    fetchProductList(params);
    formFilter.setFieldValue("status", status);
  };

  const handleSelectProductCategory = (categoryIdsSelected: Array<string>) => {
    formFilter.setFieldValue("categoryIds", categoryIdsSelected);
  };

  const handleConfirmDeleteProduct = async (productId: string) => {
    try {
      await productApi.delete(productId);
      message.success("Xóa sản phẩm thành công.");
      formFilter.submitForm();
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  const pricePopoverContent = useCallback(
    (price: number, promotions: Array<any>) => {
      return (
        <>
          <Space direction="vertical" style={{ minWidth: 300 }}>
            <Row justify="space-between">
              <span>Giá gốc</span>
              <span className={styles.oldPrice}>{formatNumber(price)} đ</span>
            </Row>
            {promotions.map((promotion: any) => (
              <>
                <Row justify="space-between">
                  <span>
                    Chương trình đang diễn ra <Badge status="error" />
                  </span>
                  <span>{promotion.name}</span>
                </Row>
                <Row justify="space-between">
                  <span>Giá khuyến mãi</span>
                  <span>{formatNumber(promotion.promotion_price)} đ</span>
                </Row>
                <Row justify="space-between">
                  <span>Thời gian</span>
                  <span>
                    {formatDate(promotion.start_time)} -&nbsp;
                    {formatDate(promotion.end_time)}
                  </span>
                </Row>
              </>
            ))}
          </Space>
        </>
      );
    },
    []
  );

  const columns: ColumnsType<any> = useMemo(
    () => [
      {
        title: "Tên sản phẩm",
        render: (_, product) => (
          <>
            {product.is_parent && (
              <Space align="start">
                <div className={styles.img}>
                  <img src={product.images[0]} />
                </div>
                <div>
                  <span className={styles.name}>{product.name}</span>
                  <div>
                    <span className={styles.sku}>
                      SKU sản phẩm: {product.parent_sku}
                    </span>
                  </div>
                </div>
              </Space>
            )}
          </>
        ),
        width: 400,
      },
      {
        title: "Phân loại hàng",
        render: (_, product) => (
          <>
            {product.isModel ? (
              <span>{product.name}</span>
            ) : (
              <span>
                {product.children ? product.children.length : 0} Phân Loại Hàng
              </span>
            )}
          </>
        ),
      },
      {
        title: "Giá",
        render: (_, product) => {
          const priceInfo = {
            price: 0,
            promotion_price: null,
          };

          if (!product.is_parent) {
            priceInfo.price = product.price;
            priceInfo.promotion_price = product.promotion_price;
          } else {
            priceInfo.price = product.models[0].price;
            priceInfo.promotion_price = product.models[0].promotion_price;
          }
          if (!isEmpty(product.variations)) {
            const productPrices = product.models.map(
              (model: any) => model.promotion_price || model.price
            );
            return (
              <Space>
                <span>{formatNumber(Math.min(...productPrices))} đ</span>
                <span>-</span>
                <span>{formatNumber(Math.max(...productPrices))} đ</span>
              </Space>
            );
          } else {
            let promotions = [];
            if (product.is_parent) {
              promotions = product.models[0].promotions;
            } else {
              promotions = product.promotions;
            }

            return (
              <Space>
                {priceInfo.promotion_price ? (
                  <>
                    <span>{formatNumber(priceInfo.promotion_price)} đ</span>
                    <span className={styles.oldPrice}>
                      {formatNumber(priceInfo.price)} đ
                    </span>
                  </>
                ) : (
                  <span>{formatNumber(priceInfo.price)} đ</span>
                )}
                {!isEmpty(promotions) && (
                  <Popover
                    content={pricePopoverContent(priceInfo.price, promotions)}
                  >
                    <Tag color="error" icon={<ExclamationCircleOutlined />}>
                      Ưu đãi
                    </Tag>
                  </Popover>
                )}
              </Space>
            );
          }
        },
      },
      {
        title: "Kho hàng",
        render: (_, product) => {
          let total = 0;
          let content = <></>;

          if (product.is_parent) {
            total = product.models.reduce(
              (result: number, model: ProductModel) => {
                const quantity = model.inventories.reduce(
                  (result: number, inventory: ProductInventory) => {
                    return (result = result + inventory.quantity);
                  },
                  0
                );

                return (result = result + quantity);
              },
              0
            );
          } else {
            total = product.inventories.reduce(
              (result: number, inventory: ProductInventory) => {
                return (result = result + inventory.quantity);
              },
              0
            );
          }

          if (product.isModel) {
            content = product.inventories.map((inventory: ProductInventory) => (
              <div key={inventory._id}>
                <Space>
                  <span>{inventory.warehouse?.name}:</span>
                  <span>{inventory.quantity}</span>
                </Space>
              </div>
            ));
          } else if (isEmpty(product.variations)) {
            content = product.models[0].inventories.map(
              (inventory: ProductInventory) => (
                <div key={inventory._id}>
                  <Space>
                    <span>{inventory.warehouse?.name}:</span>
                    <span>{inventory.quantity}</span>
                  </Space>
                </div>
              )
            );
          } else {
            content = <>Xem chi tiết mỗi phân loại</>;
          }

          return (
            <Popover content={content}>
              <span>{total}</span>
              <Button type="link" size="small" icon={<InfoCircleOutlined />} />
            </Popover>
          );
        },
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        render: (status) => <Status status={status} />,
      },
      {
        title: "Thao tác",
        render: (_, product) => (
          <>
            {product.is_parent && (
              <Space direction="vertical">
                <Button
                  type="link"
                  size="small"
                  onClick={() =>
                    navigate(replaceParams(EDIT_PRODUCT, [product._id]))
                  }
                >
                  Chỉnh sửa
                </Button>
                {product.status !== ("deleted" as StatusType) && (
                  <Popconfirm
                    title="Xóa sản phẩm này?"
                    onConfirm={() => handleConfirmDeleteProduct(product._id)}
                  >
                    <Button type="link" size="small" danger>
                      Xóa
                    </Button>
                  </Popconfirm>
                )}
              </Space>
            )}
          </>
        ),
      },
    ],
    []
  );

  return (
    <>
      <div className={styles.wrapper}>
        <Card>
          <CardTitle
            title="Danh sách sản phẩm"
            subtitle="Tổng hợp tất cả sản phẩm của hệ thống"
          />
          <Tabs
            activeKey={formFilter.values.status}
            onChange={changeFilterStatus}
          >
            <Tabs.TabPane tab="Tất cả" key="" />
            <Tabs.TabPane tab="Đang hoạt động" key="actived" />
            <Tabs.TabPane tab="Đã xóa" key="deleted" />
          </Tabs>
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

              <InputSelectProductCategory
                categoryIds={formFilter.values.categoryIds}
                onChange={handleSelectProductCategory}
                placeholder="Danh mục sản phẩm"
              />
              <Button type="primary" onClick={formFilter.submitForm}>
                Tìm kiếm
              </Button>
            </Space>
          </div>
          {formFilter.values.status !== "deleted" && (
            <div className={styles.action}>
              <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => navigate(ADD_NEW_PRODUCT)}
              >
                Tạo mới
              </Button>
            </div>
          )}

          <div>
            <Table
              size="small"
              bordered
              columns={columns}
              dataSource={handleFormatDataSourceProducts(
                productsState.products.get()
              )}
              pagination={{
                size: "default",
                pageSize: productsState.limit.get(),
                current: productsState.page.get(),
                total: productsState.total.get(),
                hideOnSinglePage: true,
                onChange: handleChangePage,
              }}
              loading={productsState.isLoadingGetAllProduct.get()}
              rowKey={(row) => row._id}
            />
          </div>
        </Card>
      </div>
    </>
  );
};

export default Products;
