import { Card, Form, Input } from "antd";
import CardTitle from "components/CardTitle";
import { ProductBasicData } from "components/ProductControl/hooks/useProductControl";
import React, { ChangeEvent, FC } from "react";

type Props = {
  parent_sku: string;
  onChangeProductBasic: (basicData: ProductBasicData) => void;
};

const ProductOther: FC<Props> = ({ parent_sku, onChangeProductBasic }) => {
  const handleSkuChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;
    onChangeProductBasic({ parent_sku: value });
  };

  return (
    <Card>
      <CardTitle title="Thông tin khác" />
      <Form labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} colon={false}>
        <Form.Item label="SKU sản phẩm">
          <Input
            value={parent_sku}
            placeholder="Nhập vào"
            onChange={handleSkuChange}
          />
        </Form.Item>
      </Form>
    </Card>
  );
};

export default React.memo(ProductOther);
