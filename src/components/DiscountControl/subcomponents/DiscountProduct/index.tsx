import { DeleteOutlined } from "@ant-design/icons";
import { none, State, useHookstate } from "@hookstate/core";
import { Avatar, Button, Card, Checkbox, Col, List, Row, Space } from "antd";
import { DiscountProduct as DiscountProductType } from "components/DiscountControl/store";
import styles from "components/DiscountControl/subcomponents/DiscountProduct/DiscountProduct.module.css";
import DiscountProductModel from "components/DiscountControl/subcomponents/DiscountProduct/subcomponents/DiscountProductModel";
import InputSelector from "components/InputSelector";
import { forwardRef, memo, useImperativeHandle, useRef } from "react";

type Props = {
  discountProductState: State<DiscountProductType>;
};

// eslint-disable-next-line react/display-name
const DiscountProduct = forwardRef(({ discountProductState }: Props, ref) => {
  const state = useHookstate(discountProductState);
  const elRefs = useRef<any>([]);
  const validateArrRef = useRef<Array<boolean>>([]);

  const changeUserItemLimit = (value: string | number) => {
    const models = JSON.parse(JSON.stringify(state.models.value));
    for (const model of models) {
      model.user_item_limit = Number(value);
    }

    state.models.set(models);
  };

  const validateAllModel = () => {
    const validateArr: Array<boolean> = elRefs.current.map((elRef: any) =>
      elRef.validate()
    );

    // save in ref array result
    validateArrRef.current = validateArr;

    return validateArr.some((result) => result);
  };

  useImperativeHandle(
    ref,
    () => ({
      validate() {
        return validateAllModel();
      },
      scrollIntoView() {
        const idx = validateArrRef.current.indexOf(false);
        elRefs.current[idx] && elRefs.current[idx].scrollIntoView();
      },
    }),
    []
  );

  const renderTitle = () => {
    return (
      <Row className={styles.titleWrapper} align="middle" gutter={16}>
        <Col className={styles.checkbox}>
          <Checkbox />
        </Col>
        <Col span={17}>
          <Space>
            <Avatar shape="square" src={state.product.get()?.images[0]} />
            {state.product.get()?.name}
          </Space>
        </Col>
        <Col span={3}>
          <InputSelector
            value={discountProductState.models[0].user_item_limit.get()}
            options={[
              {
                label: "Không giới hạn",
                value: 0,
              },
            ]}
            labelOptionOpenInput="Giới hạn"
            onChange={changeUserItemLimit}
          />
        </Col>
        <Col span={2}></Col>
        <Col span={1}>
          <Button
            icon={<DeleteOutlined />}
            shape="circle"
            onClick={() => discountProductState.set(none)}
          />
        </Col>
      </Row>
    );
  };

  return (
    <Card
      size="small"
      title={renderTitle()}
      headStyle={{ backgroundColor: "#F6F6F6" }}
      className={styles.wrapper}
    >
      <List>
        {state.models.map((modelState, idx) => (
          <DiscountProductModel
            key={modelState.product_model_id.get()}
            discountProductModelState={modelState}
            ref={(el) => (elRefs.current[idx] = el)}
          />
        ))}
      </List>
    </Card>
  );
});

export default memo(DiscountProduct);
