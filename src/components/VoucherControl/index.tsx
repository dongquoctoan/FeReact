import {
  Card,
  Input,
  DatePicker,
  Form,
  Button,
  Select,
  Row,
  Col,
  Radio,
  Affix,
  Typography,
  RadioChangeEvent,
  Space,
} from "antd";
import styles from "components/VoucherControl/VoucherControl.module.css";
import { FC, memo, ReactNode, useCallback, useEffect, useState } from "react";

import type { DatePickerProps } from "antd/es/date-picker";
import moment from "moment";
import CardTitle from "components/CardTitle";
import InputNumber from "components/InputNumber";
import ModalSelectProduct from "components/ModalSelectProduct";
import TableSelectedProduct from "components/VoucherControl/subcomponents/TableSelectedProduct";
import RadioGroupTypeVoucher from "components/VoucherControl/subcomponents/RadioGroupVoucherType";
import useVoucherControl, {
  VoucherControlState,
} from "components/VoucherControl/hooks/useVoucherControl";
import {
  AMOUNT_DISCOUNT_TYPE,
  FINISHED_STATUS,
  PERCENTAGE_DISCOUNT_TYPE,
  VOUCHER_PRODUCT_TYPE,
} from "constants/Voucher/voucherType";
import { PlusOutlined } from "@ant-design/icons";

type Props = {
  renderActions: (onSubmit: () => void, errors: object) => ReactNode;
  onSubmit: (voucherData: VoucherControlState) => void;
  initialVoucher?: VoucherControlState;
};

const { Item } = Form;

const VoucherControl: FC<Props> = ({
  renderActions,
  onSubmit,
  initialVoucher,
}) => {
  const {
    touched,
    voucherControlState,
    selectedProductsState,
    errors,
    handleChangeVoucherState,
    handleGetSelectedProduct,
    handleSubmit,
    handleChange,
    handleBlur,
  } = useVoucherControl(onSubmit, initialVoucher);

  const [visible, setVisible] = useState<boolean>(false);
  const [discountType, setDiscountType] =
    useState<string>(AMOUNT_DISCOUNT_TYPE);

  useEffect(() => {
    if (initialVoucher) {
      if (initialVoucher.discount_amount) setDiscountType(AMOUNT_DISCOUNT_TYPE);
      else setDiscountType(PERCENTAGE_DISCOUNT_TYPE);
    }
  }, [initialVoucher]);

  const handleOnChangeUsageQuantity = useCallback((value: string) => {
    handleChangeVoucherState({ usage_quantity: Number(value) });
  }, []);

  const handleOnChangeDiscountPercent = useCallback((value: string) => {
    const percent = Number(value);
    handleChangeVoucherState({
      discount_percent: percent,
      discount_amount: null,
    });
  }, []);

  const handleOnChangeMaximumDiscountAmount = useCallback((value: string) => {
    const amount = Number(value);
    handleChangeVoucherState({
      maximum_discount_amount: amount ? amount : null,
    });
  }, []);

  const handleOnChangeDiscountAmount = useCallback((value: string) => {
    const amount = Number(value);
    handleChangeVoucherState({
      discount_amount: amount,
      discount_percent: null,
      maximum_discount_amount: null,
    });
  }, []);

  const handleChangeTypeOfVoucher = useCallback((value: string) => {
    handleChangeVoucherState({ type: value });
  }, []);

  const handleChangeMinOrder = useCallback((value: string) => {
    const amount = Number(value);

    handleChangeVoucherState({ minimum_order_apply: amount });
  }, []);

  const handleSelectDiscountType = useCallback((value: string) => {
    setDiscountType(value);
    if (value === AMOUNT_DISCOUNT_TYPE)
      handleChangeVoucherState({
        is_discount_percent: false,
        discount_amount: null,
      });
    else if (value === PERCENTAGE_DISCOUNT_TYPE)
      handleChangeVoucherState({
        is_discount_percent: true,
        discount_percent: null,
      });
  }, []);

  const handleChangePrivacyVoucher = useCallback((e: RadioChangeEvent) => {
    handleChangeVoucherState({ is_private: e.target.value });
  }, []);

  const handleOnChangeStartTime = useCallback(
    (value: DatePickerProps["value"], dateString: string) => {
      handleChangeVoucherState({
        start_time: dateString || "",
      });
    },
    []
  );

  const handleOnChangeEndTime = useCallback(
    (value: DatePickerProps["value"], dateString: string) => {
      handleChangeVoucherState({
        end_time: dateString || "",
      });
    },
    []
  );

  const handleConfirmSelectedProducts = useCallback(
    (product_ids: Array<string>) => {
      handleChangeVoucherState({ product_ids });
      setVisible(false);
    },
    []
  );

  const handleOnPageChange = useCallback((page: number, pageSize: number) => {
    const params = {
      page,
      limit: pageSize,
    };
    handleGetSelectedProduct(params);
  }, []);

  const handleDeleteSelectedProduct = useCallback(
    (productId: string) => {
      const currentProductIds = [...voucherControlState.product_ids].filter(
        (el) => el !== productId
      );
      handleChangeVoucherState({ product_ids: currentProductIds });
    },
    [voucherControlState.product_ids.length]
  );

  return (
    <>
      <ModalSelectProduct
        visible={visible}
        onOk={handleConfirmSelectedProducts}
        onCancel={() => setVisible(false)}
        productIds={voucherControlState.product_ids}
      />
      <Card>
        <CardTitle
          title={
            initialVoucher ? "Chỉnh sửa mã giảm giá" : "Thêm mới mã giảm giá"
          }
          subtitle="Bổ sung thông tin cơ bản của voucher"
        />
        <Form
          labelCol={{ span: 4 }}
          layout="horizontal"
          disabled={initialVoucher?.status === FINISHED_STATUS}
        >
          <Item
            label="Áp dụng"
            style={{ alignItems: "center", display: "flex" }}
          >
            <RadioGroupTypeVoucher
              disable={initialVoucher ? true : false}
              value={voucherControlState.type}
              onChange={(value: string) => handleChangeTypeOfVoucher(value)}
            />
          </Item>
          <Item
            label="Tên chương trình giảm giá"
            validateStatus={errors.name && touched.name ? "error" : ""}
            help={errors.name && touched.name ? errors.name : null}
            wrapperCol={{ span: 7 }}
          >
            <Input
              value={voucherControlState.name}
              name="name"
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Tên mã giảm giá"
            />
          </Item>
          <Item
            label="Mã voucher"
            validateStatus={errors.code && touched.code ? "error" : ""}
            help={errors.code && touched.code ? errors.code : ""}
            wrapperCol={{ span: 7 }}
          >
            <Input
              placeholder="Mã voucher"
              name="code"
              disabled={initialVoucher ? true : false}
              value={voucherControlState.code}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Item>
          <Item
            label="Thời gian"
            validateStatus={
              (errors.start_time && touched.start_time) ||
              (errors.end_time && touched.end_time)
                ? "error"
                : ""
            }
            help={
              (errors.start_time && touched.start_time
                ? errors.start_time
                : null) ||
              (errors.end_time && touched.end_time ? errors.end_time : null)
            }
            wrapperCol={{ span: 7 }}
          >
            <Row gutter={10}>
              <Col span={10}>
                <DatePicker
                  name="start_time"
                  value={
                    voucherControlState.start_time
                      ? moment(
                          voucherControlState.start_time,
                          "HH:mm DD/MM/YYYY"
                        )
                      : null
                  }
                  onBlur={handleBlur}
                  onChange={handleOnChangeStartTime}
                  placeholder="Ngày bắt đầu"
                  format="HH:mm DD/MM/YYYY"
                  showTime={{ format: "HH:mm" }}
                />
              </Col>
              <Col span={10}>
                <DatePicker
                  value={
                    voucherControlState.end_time
                      ? moment(voucherControlState.end_time, "HH:mm DD/MM/YYYY")
                      : null
                  }
                  name="end_time"
                  onChange={handleOnChangeEndTime}
                  onBlur={handleBlur}
                  placeholder="Ngày kết thúc"
                  format="HH:mm DD/MM/YYYY"
                  showTime={{ format: "HH:mm" }}
                />
              </Col>
            </Row>
          </Item>
          <Item
            label="Giảm giá"
            validateStatus={
              discountType === PERCENTAGE_DISCOUNT_TYPE
                ? errors.discount_percent && touched.discount_percent
                  ? "error"
                  : ""
                : errors.discount_amount && touched.discount_amount
                ? "error"
                : ""
            }
            help={
              discountType === PERCENTAGE_DISCOUNT_TYPE
                ? errors.discount_percent && touched.discount_percent
                  ? errors.discount_percent
                  : null
                : errors.discount_amount && touched.discount_amount
                ? errors.discount_amount
                : null
            }
            wrapperCol={{ span: 7 }}
          >
            <Row gutter={8}>
              <Input.Group compact>
                <Select
                  className={styles.selectDiscountType}
                  value={discountType}
                  style={{ width: "30%" }}
                  onChange={handleSelectDiscountType}
                >
                  <Select.Option value={AMOUNT_DISCOUNT_TYPE}>
                    Theo số tiền
                  </Select.Option>
                  <Select.Option value={PERCENTAGE_DISCOUNT_TYPE}>
                    Theo %
                  </Select.Option>
                </Select>
                {discountType === PERCENTAGE_DISCOUNT_TYPE ? (
                  <InputNumber
                    placeholder="Nhập giá trị lớn hơn 1%"
                    value={
                      voucherControlState.discount_percent
                        ? voucherControlState.discount_percent.toString()
                        : ""
                    }
                    name="discount_percent"
                    onChange={(value) => handleOnChangeDiscountPercent(value)}
                    onBlur={handleBlur}
                    addonAfter="%"
                    allowNegative={false}
                    style={{ width: "70%", padding: "0 3px 0 0" }}
                  />
                ) : (
                  <InputNumber
                    placeholder="Nhập vào số tiền giảm giá"
                    name="discount_amount"
                    value={
                      voucherControlState.discount_amount
                        ? voucherControlState.discount_amount.toString()
                        : ""
                    }
                    onChange={(value) => handleOnChangeDiscountAmount(value)}
                    onBlur={handleBlur}
                    addonAfter="đ"
                    allowNegative={false}
                    style={{ width: "70%", padding: "0 3px 0 0" }}
                  />
                )}
              </Input.Group>
            </Row>
          </Item>
          {discountType === PERCENTAGE_DISCOUNT_TYPE ? (
            <Item
              label="Giảm giá tối đa"
              validateStatus={
                errors.maximum_discount_amount &&
                touched.maximum_discount_amount
                  ? "error"
                  : ""
              }
              wrapperCol={{ span: 7 }}
            >
              <InputNumber
                placeholder="Nhập số tiền giảm giá tối đa"
                name="maximum_discount_amount"
                value={
                  voucherControlState.maximum_discount_amount
                    ? voucherControlState.maximum_discount_amount.toString()
                    : ""
                }
                onChange={(value) => handleOnChangeMaximumDiscountAmount(value)}
                onBlur={handleBlur}
                addonAfter="đ"
                allowNegative={false}
              />
            </Item>
          ) : null}
          <Item
            label="Giá trị đơn hàng tối thiểu"
            validateStatus={
              errors.minimum_order_apply && touched.minimum_order_apply
                ? "error"
                : ""
            }
            help={
              errors.minimum_order_apply && touched.minimum_order_apply
                ? errors.minimum_order_apply
                : null
            }
            wrapperCol={{ span: 7 }}
          >
            <InputNumber
              value={
                voucherControlState.minimum_order_apply
                  ? voucherControlState.minimum_order_apply.toString()
                  : ""
              }
              name="minimum_order_apply"
              onChange={(value) => handleChangeMinOrder(value)}
              onBlur={handleBlur}
              allowNegative={false}
              placeholder="Nhập vào"
              addonAfter="đ"
            />
          </Item>
          <Item
            label="Lượt sử dụng tối đa"
            validateStatus={
              errors.usage_quantity && touched.usage_quantity ? "error" : ""
            }
            help={
              errors.usage_quantity && touched.usage_quantity
                ? errors.usage_quantity
                : null
            }
            wrapperCol={{ span: 7 }}
          >
            <InputNumber
              value={
                voucherControlState.usage_quantity
                  ? voucherControlState.usage_quantity.toString()
                  : ""
              }
              name="usage_quantity"
              onChange={(value) => handleOnChangeUsageQuantity(value)}
              onBlur={handleBlur}
              allowNegative={false}
              placeholder="Nhập vào"
            />
          </Item>
          <Item label="Loại voucher">
            <Radio.Group
              value={voucherControlState.is_private}
              onChange={handleChangePrivacyVoucher}
            >
              <Radio value={false}>Hiển thị nhiều nơi</Radio>
              <Radio value={true}>Không công khai</Radio>
            </Radio.Group>
          </Item>
          {voucherControlState.type === VOUCHER_PRODUCT_TYPE && (
            <>
              <Item
                label="Sản phẩm áp dụng"
                validateStatus={
                  errors.product_ids && touched.product_ids ? "error" : ""
                }
                help={
                  errors.product_ids && touched.product_ids
                    ? errors.product_ids
                    : null
                }
                wrapperCol={{ span: 16 }}
              >
                <div className={styles.btnAddProductWrapper}>
                  {voucherControlState.product_ids.length !== 0 && (
                    <Typography.Text>
                      <strong>{voucherControlState.product_ids.length}</strong>
                      &nbsp;
                      <span style={{ color: "#999" }}>sản phẩm được chọn</span>
                    </Typography.Text>
                  )}
                  <Button
                    type="primary"
                    onClick={() => setVisible(true)}
                    disabled={initialVoucher?.status === FINISHED_STATUS}
                    icon={<PlusOutlined />}
                    ghost
                  >
                    Thêm sản phẩm
                  </Button>
                </div>
              </Item>
              <Item wrapperCol={{ offset: 4, span: 16 }}>
                <TableSelectedProduct
                  products={selectedProductsState.products}
                  page={selectedProductsState.page}
                  limit={selectedProductsState.limit}
                  total={selectedProductsState.total}
                  isLoadingGetAllSelectedProduct={
                    selectedProductsState.isLoadingGetAllSelectedProduct
                  }
                  handleOnPageChange={handleOnPageChange}
                  handleDeleteSelectedProduct={handleDeleteSelectedProduct}
                  disabled={initialVoucher?.status === FINISHED_STATUS}
                />
              </Item>
            </>
          )}
        </Form>
      </Card>
      <Affix offsetBottom={0}>
        <div className={styles.action}>
          {renderActions(handleSubmit, errors)}
        </div>
      </Affix>
    </>
  );
};

export default memo(VoucherControl);
