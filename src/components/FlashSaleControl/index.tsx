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
import styles from "components/FlashSaleControl/FlashSaleControl.module.css";
import flashsaleControlStore, {
  FlashSaleProduct as FlashSaleProductType,
  resetState,
} from "components/FlashSaleControl/store";
import FlashSaleProduct from "components/FlashSaleControl/subcomponents/FlashSaleProduct";
import ModalSelectProduct from "components/ModalSelectProduct";
import {
  FlashSaleProductModel,
  NewFlashSaleData,
} from "constants/types/flashsale.type";
import { Product } from "constants/types/product.type";
import useComponentMounted from "hooks/useComponentMounted";
import { usePrevious } from "hooks/usePrevious";
import { isEqual, union } from "lodash";
import moment from "moment";
import React, { createRef, FC, memo, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LIST_FLASH_SALE } from "routes/route.constant";
import { z } from "zod";

const { RangePicker } = DatePicker;

const PAGE_SIZE = 10;

type FlashSaleControlBasicError = {
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

export type InitialFlashSale = {
  name: string;
  startTime: string;
  endTime: string;
  flashsaleProductModels: Array<FlashSaleProductModel>;
};

type Props = {
  initialFlashSale?: InitialFlashSale;
  type?: "edit" | "add";
  onSubmit: (data: NewFlashSaleData) => void;
};

const FlashSaleControl: FC<Props> = ({ initialFlashSale, type, onSubmit }) => {
  const navigate = useNavigate();
  const flashsaleControlState = useHookstate(flashsaleControlStore);
  const [isOpenSelectProducts, setIsOpenSelectProducts] =
    useState<boolean>(false);

  const elRefs = useRef<any>([]);
  if (
    elRefs.current.length !== flashsaleControlState.flashsale_products.length
  ) {
    // add or remove refs
    elRefs.current = Array(flashsaleControlState.flashsale_products.length)
      .fill(null)
      .map((_, i) => elRefs.current[i] || createRef());
  }

  // error name and time
  const errorBasicState =
    useHookstate<FlashSaleControlBasicError>(initialBasicError);

  const prevInitialFlashSale = usePrevious(initialFlashSale);
  const disabledProductIds = useRef<Array<string>>([]);

  // initial data
  useEffect(() => {
    if (initialFlashSale && !isEqual(initialFlashSale, prevInitialFlashSale)) {
      const productIds = union(
        initialFlashSale.flashsaleProductModels.map((model) => model.product_id)
      );
      disabledProductIds.current = productIds;
      const { name, startTime, endTime } = initialFlashSale;

      flashsaleControlState.name.set(name);
      flashsaleControlState.start_time.set(startTime);
      flashsaleControlState.end_time.set(endTime);

      initFlashSaleProductList(productIds);
    }
  }, [initialFlashSale]);

  const validateBasicFlashSaleSetting = () => {
    const result = validateBasicSchema.safeParse(flashsaleControlState.value);

    if (result.success == false) {
      const errors: any = result.error.flatten().fieldErrors;
      errorBasicState.set(errors);
      return false;
    } else {
      errorBasicState.set(initialBasicError);
      return true;
    }
  };

  const validateFlashSaleProductSetting = () => {
    const resultArr: Array<boolean> = elRefs.current.map((elRef: any) => {
      return elRef.current.validate();
    });

    const idx = resultArr.indexOf(false);

    if (idx >= 0) {
      const page = Math.floor(idx / PAGE_SIZE) + 1;
      setFlashSaleProductPage(page);
      elRefs.current[idx].current.scrollIntoView();

      return false;
    }

    return true;
  };

  const changeFlashSaleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    flashsaleControlState.name.set(name);
  };

  const changeFlashSaleTime = (value: any, dateStrings: [string, string]) => {
    flashsaleControlState.start_time.set(dateStrings[0]);
    flashsaleControlState.end_time.set(dateStrings[1]);
  };

  // get flashsale product list
  const fetchFlashSaleProductList = async (
    selectedProductIds: Array<string>
  ) => {
    const flashsaleProductListRes =
      await discountApi.getDiscountProductItemList(selectedProductIds);
    const products: Array<Product> = flashsaleProductListRes.data.result;
    return products;
  };

  const setFlashSaleProductList = async (selectedProductIds: Array<string>) => {
    try {
      const products = await fetchFlashSaleProductList(selectedProductIds);
      // get current productids of state
      const productIds = flashsaleControlState.flashsale_products.map(
        (flashsaleProductState) => flashsaleProductState.get().product?._id
      );

      const flashsaleProductList = products.reduce(
        (result: Array<FlashSaleProductType>, product) => {
          if (!productIds.includes(product._id)) {
            const flashsaleProductModels: Array<FlashSaleProductModel> =
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
              models: flashsaleProductModels,
            });
          }

          return result;
        },
        []
      );

      flashsaleControlState.flashsale_products.merge(flashsaleProductList);
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  const initFlashSaleProductList = async (productIds: Array<string>) => {
    try {
      const products = await fetchFlashSaleProductList(productIds);
      const flashsaleProductList = products.reduce(
        (result: Array<FlashSaleProductType>, product) => {
          const flashsaleProductModels: Array<FlashSaleProductModel> =
            product.models.map((model) => {
              // kiểm tra initialFlashSale có model ko
              if (type == "edit" && initialFlashSale) {
                const flashsaleProductModel =
                  initialFlashSale.flashsaleProductModels.find(
                    (flashsaleProductModel) =>
                      flashsaleProductModel.product_model_id == model._id
                  );

                if (flashsaleProductModel) {
                  return {
                    _id: flashsaleProductModel._id,
                    product_id: flashsaleProductModel.product_id,
                    product_model_id:
                      flashsaleProductModel.product_model_id || "",
                    promotion_price: flashsaleProductModel.promotion_price,
                    promotion_stock: flashsaleProductModel.promotion_stock,
                    user_item_limit: flashsaleProductModel.user_item_limit,
                    is_actived: true,
                    name: flashsaleProductModel.name,
                    stock: flashsaleProductModel.stock,
                    price: flashsaleProductModel.price,
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
            models: flashsaleProductModels,
          });

          return result;
        },
        []
      );

      flashsaleControlState.flashsale_products.set(flashsaleProductList);
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  const selectProducts = (productIds: Array<string>) => {
    setFlashSaleProductList(productIds);
    setIsOpenSelectProducts(false);
  };

  const [flashSaleProductPage, setFlashSaleProductPage] = useState<number>(1);
  const changeFlashSaleProductPage = (page: number) => {
    setFlashSaleProductPage(page);
  };

  // submit
  const submitForm = async () => {
    try {
      const cloneData = JSON.parse(JSON.stringify(flashsaleControlState.value));
      const flashsaleProductModels = [];

      for (const flashsaleProduct of cloneData.flashsale_products) {
        for (const model of flashsaleProduct.models) {
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
            flashsaleProductModels.push({
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

      if (!flashsaleProductModels.length) {
        message.error("Vui lòng thêm sản phẩm khuyến mãi.");
        return;
      }

      const validBasicSetting = validateBasicFlashSaleSetting();
      const validFlashSaleProductSetting = validateFlashSaleProductSetting();

      if (!validBasicSetting || !validFlashSaleProductSetting) return;

      onSubmit({
        name: cloneData.name,
        start_time: cloneData.start_time,
        end_time: cloneData.end_time,
        flashsale_product_models: flashsaleProductModels,
      });
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  const cancelFlashSaleControl = () => {
    resetState();
    navigate(LIST_FLASH_SALE);
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
        productIds={flashsaleControlState.flashsale_products.map(
          (flashsaleProduct) => flashsaleProduct.get().product?._id || ""
        )}
        disabledProductIds={disabledProductIds.current}
      />
      <Card>
        <CardTitle title="Thông tin cơ bản" />
        <Form colon={false} labelCol={{ span: 4 }} wrapperCol={{ span: 7 }}>
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
              onChange={changeFlashSaleName}
              value={flashsaleControlState.name.get()}
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
              onChange={changeFlashSaleTime}
              value={[
                JSON.parse(
                  JSON.stringify(flashsaleControlState.start_time.get())
                ) &&
                  moment(
                    flashsaleControlState.start_time.get(),
                    "HH:mm DD/MM/YYYY"
                  ),
                JSON.parse(
                  JSON.stringify(flashsaleControlState.end_time.get())
                ) &&
                  moment(
                    flashsaleControlState.end_time.get(),
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
        {flashsaleControlState.flashsale_products.length > 0 && (
          <>
            <div className={styles.flashSaleProductsHeader}>
              <Row align="middle" gutter={16}>
                <Col className={styles.checkbox}>
                  <Checkbox />
                </Col>
                <Col span={4}>Tên sản phẩm</Col>
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
              {flashsaleControlState.flashsale_products.map(
                (flashsaleProductState, idx) => {
                  return (
                    <List.Item
                      key={flashsaleProductState.product.get()?._id}
                      style={{
                        display:
                          idx >= PAGE_SIZE * flashSaleProductPage ||
                          idx < PAGE_SIZE * (flashSaleProductPage - 1)
                            ? "none"
                            : "block",
                      }}
                    >
                      <FlashSaleProduct
                        flashsaleProductState={flashsaleProductState}
                        // ref={(el) => (elRefs.current[idx] = el)}
                        ref={elRefs.current[idx]}
                      />
                    </List.Item>
                  );
                }
              )}
            </List>
            <Pagination
              total={flashsaleControlState.flashsale_products.length}
              pageSize={PAGE_SIZE}
              current={flashSaleProductPage}
              onChange={changeFlashSaleProductPage}
              hideOnSinglePage
            />
          </>
        )}
      </Card>
      <Affix offsetBottom={0}>
        <Card style={{ marginTop: 16 }}>
          <Space>
            <Button onClick={cancelFlashSaleControl}>Hủy</Button>
            <Button type="primary" onClick={submitForm}>
              Xác nhận
            </Button>
          </Space>
        </Card>
      </Affix>
    </>
  );
};

export default memo(FlashSaleControl);
