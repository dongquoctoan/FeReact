import { PlusOutlined } from "@ant-design/icons";
import { useHookstate } from "@hookstate/core";
import {
  Affix,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  List,
  message,
  Pagination,
  Row,
  Space,
} from "antd";
import discountApi from "apis/discount";
import CardTitle from "components/CardTitle";
import styles from "components/DiscountControl/DiscountControl.module.css";
import discountControlStore, {
  DiscountProduct as DiscountProductType,
  resetState,
} from "components/DiscountControl/store";
import DiscountProduct from "components/DiscountControl/subcomponents/DiscountProduct";
import ModalSelectProduct from "components/ModalSelectProduct";
import {
  DiscountProductModel,
  NewDiscountData,
} from "constants/types/discount.type";
import { Product } from "constants/types/product.type";
import useComponentMounted from "hooks/useComponentMounted";
import { usePrevious } from "hooks/usePrevious";
import { isEqual, union } from "lodash";
import moment from "moment";
import React, { createRef, FC, memo, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DISCOUNT_LIST } from "routes/route.constant";
import { z } from "zod";

const { RangePicker } = DatePicker;

const PAGE_SIZE = 10;

type DiscountControlBasicError = {
  name: Array<string>;
  time: Array<string>;
};

const validateBasicSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: "Tên chương trình không được để trống." }),
    start_time: z.string(),
    end_time: z.string(),
  })
  .refine((data: any) => data.start_time || data.end_time, {
    message: "Thời gian khuyến mãi không được để trống.",
    path: ["time"],
  });

const initialBasicError = {
  name: [],
  time: [],
};

export type InitialDiscount = {
  name: string;
  startTime: string;
  endTime: string;
  discountProductModels: Array<DiscountProductModel>;
};

type Props = {
  initialDiscount?: InitialDiscount;
  type?: "edit" | "add";
  onSubmit: (data: NewDiscountData) => void;
};

const DiscountControl: FC<Props> = ({ initialDiscount, type, onSubmit }) => {
  const navigate = useNavigate();
  const discountControlState = useHookstate(discountControlStore);
  const [isOpenSelectProducts, setIsOpenSelectProducts] =
    useState<boolean>(false);

  const elRefs = useRef<any>([]);
  if (elRefs.current.length !== discountControlState.discount_products.length) {
    // add or remove refs
    elRefs.current = Array(discountControlState.discount_products.length)
      .fill(null)
      .map((_, i) => elRefs.current[i] || createRef());
  }

  // error name and time
  const errorBasicState =
    useHookstate<DiscountControlBasicError>(initialBasicError);

  const prevInitialDiscount = usePrevious(initialDiscount);
  const disabledProductIds = useRef<Array<string>>([]);

  // initial data
  useEffect(() => {
    if (initialDiscount && !isEqual(initialDiscount, prevInitialDiscount)) {
      const productIds = union(
        initialDiscount.discountProductModels.map((model) => model.product_id)
      );
      disabledProductIds.current = productIds;
      const { name, startTime, endTime } = initialDiscount;

      discountControlState.name.set(name);
      discountControlState.start_time.set(startTime);
      discountControlState.end_time.set(endTime);

      initDiscountProductList(productIds);
    }
  }, [initialDiscount]);

  const validateBasicDiscountSetting = () => {
    const result = validateBasicSchema.safeParse(discountControlState.value);

    if (result.success == false) {
      const errors: any = result.error.flatten().fieldErrors;
      errorBasicState.set(errors);
      return false;
    } else {
      errorBasicState.set(initialBasicError);
      return true;
    }
  };

  const validateDiscountProductSetting = () => {
    const resultArr: Array<boolean> = elRefs.current.map((elRef: any) => {
      return elRef.current.validate();
    });

    const idx = resultArr.indexOf(false);

    if (idx >= 0) {
      const page = Math.floor(idx / PAGE_SIZE) + 1;
      setDiscountProductPage(page);
      elRefs.current[idx].current.scrollIntoView();

      return false;
    }

    return true;
  };

  const changeDiscountName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    discountControlState.name.set(name);
  };

  const changeDiscountTime = (value: any, dateStrings: [string, string]) => {
    discountControlState.start_time.set(dateStrings[0]);
    discountControlState.end_time.set(dateStrings[1]);
  };

  // get discount product list
  const fetchDiscountProductList = async (
    selectedProductIds: Array<string>
  ) => {
    const discountProductListRes = await discountApi.getDiscountProductItemList(
      selectedProductIds
    );
    const products: Array<Product> = discountProductListRes.data.result;
    return products;
  };

  const setDiscountProductList = async (selectedProductIds: Array<string>) => {
    try {
      const products = await fetchDiscountProductList(selectedProductIds);
      // get current productids of state
      const productIds = discountControlState.discount_products.map(
        (discountProductState) => discountProductState.get().product?._id
      );

      const discountProductList = products.reduce(
        (result: Array<DiscountProductType>, product) => {
          if (!productIds.includes(product._id)) {
            const discountProductModels: Array<DiscountProductModel> =
              product.models.map((model) => {
                return {
                  product_id: model.product_id || "",
                  product_model_id: model._id || "",
                  promotion_price: model.price,
                  promotion_stock: 0,
                  user_item_limit: 0,
                  is_actived: true,
                  name: model.name || "",
                  stock: model.stock || 0,
                  price: model.price,
                };
              });

            result.push({
              product,
              models: discountProductModels,
            });
          }

          return result;
        },
        []
      );

      discountControlState.discount_products.merge(discountProductList);
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  const initDiscountProductList = async (productIds: Array<string>) => {
    try {
      const products = await fetchDiscountProductList(productIds);
      const discountProductList = products.reduce(
        (result: Array<DiscountProductType>, product) => {
          const discountProductModels: Array<DiscountProductModel> =
            product.models.map((model) => {
              // kiểm tra initialDiscount có model ko
              if (type == "edit" && initialDiscount) {
                const discountProductModel =
                  initialDiscount.discountProductModels.find(
                    (discountProductModel) =>
                      discountProductModel.product_model_id == model._id
                  );

                if (discountProductModel) {
                  return {
                    _id: discountProductModel._id,
                    product_id: discountProductModel.product_id,
                    product_model_id:
                      discountProductModel.product_model_id || "",
                    promotion_price: discountProductModel.promotion_price,
                    promotion_stock: discountProductModel.promotion_stock,
                    user_item_limit: discountProductModel.user_item_limit,
                    is_actived: true,
                    name: discountProductModel.name,
                    stock: discountProductModel.stock,
                    price: discountProductModel.price,
                  };
                }
              }
              return {
                product_id: model.product_id || "",
                product_model_id: model._id || "",
                promotion_price: model.price,
                promotion_stock: 0,
                user_item_limit: 0,
                is_actived: false,
                name: model.name || "",
                stock: model.stock || 0,
                price: model.price,
              };
            });

          result.push({
            product,
            models: discountProductModels,
          });

          return result;
        },
        []
      );

      discountControlState.discount_products.set(discountProductList);
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  const selectProducts = (productIds: Array<string>) => {
    setDiscountProductList(productIds);
    setIsOpenSelectProducts(false);
  };

  const [discountProductPage, setDiscountProductPage] = useState<number>(1);
  const changeDiscountProductPage = (page: number) => {
    setDiscountProductPage(page);
  };

  // submit
  const submitForm = async () => {
    try {
      const cloneData = JSON.parse(JSON.stringify(discountControlState.value));
      const discountProductModels = [];

      for (const discountProduct of cloneData.discount_products) {
        for (const model of discountProduct.models) {
          const {
            product_id,
            product_model_id,
            promotion_price,
            promotion_stock,
            user_item_limit,
            is_actived,
            _id,
          } = model;
          if (is_actived) {
            discountProductModels.push({
              _id,
              product_id,
              product_model_id,
              promotion_price,
              promotion_stock,
              user_item_limit,
              is_actived,
            });
          }
        }
      }

      if (!discountProductModels.length) {
        message.error("Vui lòng thêm sản phẩm khuyến mãi.");
        return;
      }

      const validBasicSetting = validateBasicDiscountSetting();
      const validDiscountProductSetting = validateDiscountProductSetting();

      if (!validBasicSetting || !validDiscountProductSetting) return;

      onSubmit({
        name: cloneData.name,
        start_time: cloneData.start_time,
        end_time: cloneData.end_time,
        discount_product_models: discountProductModels,
      });
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  const cancelDiscountControl = () => {
    resetState();
    navigate(DISCOUNT_LIST);
  };

  const isMounted = useComponentMounted();

  useEffect(() => {
    return () => {
      if (isMounted) {
        resetState();
      }
    };
  }, [isMounted]);

  return (
    <>
      <ModalSelectProduct
        visible={isOpenSelectProducts}
        onCancel={() => setIsOpenSelectProducts(false)}
        onOk={selectProducts}
        productIds={discountControlState.discount_products.map(
          (discountProduct) => discountProduct.get().product?._id || ""
        )}
        disabledProductIds={disabledProductIds.current}
      />
      <Card>
        <CardTitle title="Thông tin cơ bản" />
        <Form
          colon={false}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 7 }}
          labelWrap
        >
          <Form.Item
            label="Tên chương trình khuyến mãi"
            help={errorBasicState.name[0] && errorBasicState.name[0].get()}
            validateStatus={
              errorBasicState.name[0] && errorBasicState.name[0].get()
                ? "error"
                : ""
            }
          >
            <Input
              onChange={changeDiscountName}
              value={discountControlState.name.get()}
              placeholder="Nhập vào"
            />
          </Form.Item>
          <Form.Item
            label="Thời gian khuyến mãi"
            help={errorBasicState.time[0] && errorBasicState.time[0].get()}
            validateStatus={
              errorBasicState.time[0] && errorBasicState.time[0].get()
                ? "error"
                : ""
            }
          >
            <RangePicker
              showTime={{ showSecond: false }}
              format="HH:mm DD/MM/YYYY"
              onChange={changeDiscountTime}
              value={[
                JSON.parse(
                  JSON.stringify(discountControlState.start_time.get())
                ) &&
                  moment(
                    discountControlState.start_time.get(),
                    "HH:mm DD/MM/YYYY"
                  ),
                JSON.parse(
                  JSON.stringify(discountControlState.end_time.get())
                ) &&
                  moment(
                    discountControlState.end_time.get(),
                    "HH:mm DD/MM/YYYY"
                  ),
              ]}
            />
          </Form.Item>
        </Form>
      </Card>
      <Card style={{ marginTop: 16 }}>
        <CardTitle
          title="Sản phẩm khuyến mãi"
          subtitle="Thêm sản phẩm vào chương trình khuyến mãi và thiết lập giá khuyến mãi."
        />
        <Button
          type="primary"
          ghost
          icon={<PlusOutlined />}
          onClick={() => setIsOpenSelectProducts(true)}
        >
          Thêm sản phẩm
        </Button>
        {discountControlState.discount_products.length > 0 && (
          <>
            <div className={styles.discountProductsHeader}>
              <Row align="middle" gutter={16}>
                <Col className={styles.checkbox}>
                  <Checkbox />
                </Col>
                <Col span={3}>Tên sản phẩm</Col>
                <Col span={3}>Giá gốc</Col>
                <Col span={3} style={{ minWidth: "150px" }}>
                  Giá sau giảm
                </Col>
                <Col span={1}></Col>
                <Col span={2} style={{ minWidth: "100px" }}>
                  Giảm giá
                </Col>
                <Col span={2}>Kho hàng</Col>
                <Col span={3}>Số lượng sản phẩm khuyến mãi</Col>
                <Col span={3}>Giới hạn đặt hàng</Col>
                <Col span={2}>Bật / Tắt</Col>
              </Row>
            </div>
            <List split={false}>
              {discountControlState.discount_products.map(
                (discountProductState, idx) => {
                  return (
                    <List.Item
                      key={discountProductState.product.get()?._id}
                      style={{
                        display:
                          idx >= PAGE_SIZE * discountProductPage ||
                          idx < PAGE_SIZE * (discountProductPage - 1)
                            ? "none"
                            : "block",
                      }}
                    >
                      <DiscountProduct
                        discountProductState={discountProductState}
                        // ref={(el) => (elRefs.current[idx] = el)}
                        ref={elRefs.current[idx]}
                      />
                    </List.Item>
                  );
                }
              )}
            </List>
            <Pagination
              total={discountControlState.discount_products.length}
              pageSize={PAGE_SIZE}
              current={discountProductPage}
              onChange={changeDiscountProductPage}
              hideOnSinglePage
            />
          </>
        )}
      </Card>
      <Affix offsetBottom={0}>
        <Card style={{ marginTop: 16 }}>
          <Space>
            <Button onClick={cancelDiscountControl}>Hủy</Button>
            <Button type="primary" onClick={submitForm}>
              Xác nhận
            </Button>
          </Space>
        </Card>
      </Affix>
    </>
  );
};

export default memo(DiscountControl);
