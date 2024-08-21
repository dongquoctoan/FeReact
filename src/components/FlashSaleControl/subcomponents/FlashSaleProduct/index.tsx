import { DeleteOutlined } from "@ant-design/icons";
import { none, State, useHookstate } from "@hookstate/core";
import { Avatar, Button, Card, Checkbox, Col, List, Row, Space } from "antd";
import { FlashSaleProduct as FlashSaleProductType } from "components/FlashSaleControl/store";
import styles from "components/FlashSaleControl/subcomponents/FlashSaleProduct/FlashSaleProduct.module.css";
import FlashSaleProductModel from "components/FlashSaleControl/subcomponents/FlashSaleProduct/subcomponents/FlashSaleProductModel";
import InputSelector from "components/InputSelector";
import { forwardRef, memo, useImperativeHandle, useRef } from "react";

type Props = {
  flashsaleProductState: State<FlashSaleProductType>;
};

// eslint-disable-next-line react/display-name
const FlashSaleProduct = forwardRef(({ flashsaleProductState }: Props, ref) => {
  const state = useHookstate(flashsaleProductState);
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
        <Col span={18}>
          <Space>
            <Avatar shape="square" src={state.product.get()?.images[0]} />
            {state.product.get()?.name}
          </Space>
        </Col>
        <Col span={3}>
          <InputSelector
            value={flashsaleProductState.models[0].user_item_limit.get()}
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
        <Col span={1}></Col>
        <Col span={1}>
          <Button
            icon={<DeleteOutlined />}
            shape="circle"
            onClick={() => flashsaleProductState.set(none)}
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
          <FlashSaleProductModel
            key={modelState.product_model_id.get()}
            flashsaleProductModelState={modelState}
            ref={(el) => (elRefs.current[idx] = el)}
          />
        ))}
      </List>
    </Card>
  );
});

export default memo(FlashSaleProduct);
