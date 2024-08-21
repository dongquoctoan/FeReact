import { State, useHookstate } from "@hookstate/core";
import { Col, Form, List, Row, Switch } from "antd";
import InputNumber from "components/InputNumber";
import InputSelector from "components/InputSelector";
import PriceText from "components/PriceText";
import { DiscountProductModel as DiscountProductModelType } from "constants/types/discount.type";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useRef,
} from "react";
import { z } from "zod";

type Props = {
  discountProductModelState: State<DiscountProductModelType>;
};

type DiscountProductModelError = {
  promotion_stock: Array<string>;
};

const validateDiscountProductModelSchema = z
  .object({
    promotion_stock: z.number().nonnegative(),
    stock: z.number(),
  })
  .refine(
    (data: any) => !data.promotion_stock || data.promotion_stock < data.stock,
    {
      message: "Số lượng phải nhỏ hơn tồn kho hiện tại.",
      path: ["promotion_stock"],
    }
  );

// eslint-disable-next-line react/display-name
const DiscountProductModel = forwardRef(
  ({ discountProductModelState }: Props, ref) => {
    const state = useHookstate(discountProductModelState);
    const [discountPercent, setDiscountPercent] = useState<number>(0);
    const errorState = useHookstate<DiscountProductModelError>({
      promotion_stock: [],
    });

    const validateModel = () => {
      const result = validateDiscountProductModelSchema.safeParse(
        discountProductModelState.value
      );

      if (result.success == false) {
        const errors: any = result.error.flatten().fieldErrors;
        errorState.set(errors);
        return false;
      } else {
        errorState.set({
          promotion_stock: [],
        });

        return true;
      }
    };

    const modelRef = useRef<HTMLElement>(null);

    useImperativeHandle(
      ref,
      () => ({
        validate() {
          return validateModel();
        },
        scrollIntoView() {
          setTimeout(() => {
            modelRef.current &&
              modelRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest",
              });
          }, 1000);
        },
      }),
      []
    );

    const changePromotionPrice = (priceString: string) => {
      state.promotion_price.set(Number(priceString));
    };

    const changeDiscountPercent = (value: string) => {
      const promotionPrice = Math.round(
        ((100 - Number(value)) * state.price.get()) / 100
      );
      state.promotion_price.set(promotionPrice);
    };

    const changePromotionStock = (value: string | number) => {
      state.promotion_stock.set(Number(value));
      validateModel();
    };

    useEffect(() => {
      const percent = Math.round(
        ((state.price.get() - state.promotion_price.get()) /
          state.price.get()) *
          100
      );
      setDiscountPercent(percent);
    }, [state.promotion_price]);

    return (
      <List.Item ref={modelRef}>
        <Row align="middle" gutter={16} style={{ width: "100%" }}>
          <Col style={{ width: 30 }}></Col>
          <Col span={3}>
            <Form.Item>{state.name.get()}</Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item>
              <PriceText prices={[state.price.get()]} />
            </Form.Item>
          </Col>
          <Col span={3} style={{ minWidth: "150px" }}>
            <Form.Item>
              <InputNumber
                addonBefore="đ"
                value={state.promotion_price.get().toString()}
                onChange={changePromotionPrice}
                max={state.price.get()}
                min={0}
              />
            </Form.Item>
          </Col>
          <Col span={1}>
            <Form.Item>Hoặc</Form.Item>
          </Col>
          <Col span={2} style={{ minWidth: "100px" }}>
            <Form.Item>
              <InputNumber
                addonAfter="%"
                value={discountPercent.toString()}
                onChange={changeDiscountPercent}
                max={100}
                min={0}
              />
            </Form.Item>
          </Col>
          <Col span={2}>
            <Form.Item>{state.stock.get()}</Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item
              validateStatus={
                errorState.promotion_stock[0] &&
                errorState.promotion_stock[0].get()
                  ? "error"
                  : ""
              }
              help={
                errorState.promotion_stock[0] &&
                errorState.promotion_stock[0].get()
              }
            >
              <InputSelector
                value={state.promotion_stock.get()}
                options={[
                  {
                    label: "Không giới hạn",
                    value: 0,
                  },
                ]}
                labelOptionOpenInput="Giới hạn"
                onChange={changePromotionStock}
              />
            </Form.Item>
          </Col>
          <Col span={3}></Col>
          <Col span={2}>
            <Form.Item>
              <Switch
                size="small"
                checked={state.is_actived.get()}
                onChange={state.is_actived.set}
              />
            </Form.Item>
          </Col>
          <Col span={1}></Col>
        </Row>
      </List.Item>
    );
  }
);

export default DiscountProductModel;
