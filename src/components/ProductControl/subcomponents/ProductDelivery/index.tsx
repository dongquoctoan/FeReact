import { Card, Form, Space } from "antd";
import CardTitle from "components/CardTitle";
import InputNumber from "components/InputNumber";
import {
  ErrorProductControl,
  ProductBasicData,
} from "components/ProductControl/hooks/useProductControl";
import { Dimension } from "constants/types/product.type";
import React, { FC } from "react";

type Props = {
  weight: number;
  dimension: Dimension;
  errors: ErrorProductControl;
  onChangeProductBasic: (basicData: ProductBasicData) => void;
};

const ProductDelivery: FC<Props> = ({
  weight,
  dimension,
  errors,
  onChangeProductBasic,
}) => {
  const handleWeightChange = (value: string) => {
    onChangeProductBasic({ weight: Number(value) });
  };

  const handleDimensionChange = (value: string, field: string) => {
    onChangeProductBasic({
      dimension: {
        ...dimension,
        [field]: Number(value),
      },
    });
  };

  return (
    <Card>
      <CardTitle title="Vận chuyển" />
      <Form
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 22 }}
        colon={false}
        labelWrap
      >
        <Form.Item
          label="Cân nặng (sau khi đóng gói)"
          required
          validateStatus={errors.weight ? "error" : ""}
          help={errors.weight}
        >
          <InputNumber
            value={weight.toString()}
            onChange={handleWeightChange}
            allowNegative={false}
            addonAfter="gram"
          />
        </Form.Item>
        <Form.Item label="Kích thước đóng gói (Phí vận chuyển thực tế sẽ thay đổi nếu bạn nhập sai kích thước)">
          <Space>
            <InputNumber
              value={dimension.width.toString()}
              onChange={(value) => handleDimensionChange(value, "width")}
              addonAfter="cm"
              placeholder="Rộng"
            />
            <InputNumber
              value={dimension.length.toString()}
              onChange={(value) => handleDimensionChange(value, "length")}
              addonAfter="cm"
              placeholder="Dài"
            />
            <InputNumber
              value={dimension.height.toString()}
              onChange={(value) => handleDimensionChange(value, "height")}
              addonAfter="cm"
              placeholder="Cao"
            />
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default React.memo(ProductDelivery);
