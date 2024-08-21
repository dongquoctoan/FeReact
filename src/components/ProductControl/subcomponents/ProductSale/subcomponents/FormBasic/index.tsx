import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Form } from "antd";
import InputNumber from "components/InputNumber";
import { ErrorProductControl } from "components/ProductControl/hooks/useProductControl";
import { ProductModel } from "constants/types/product.type";
import { FC } from "react";
import SettingInventory from "components/ProductControl/subcomponents/ProductSale/subcomponents/SettingInventory";

type Props = {
  models: Array<ProductModel>;
  onAddProductVariation: () => void;
  onChangeProductModel: (model: ProductModel, position: number) => void;
  errors: ErrorProductControl;
};

const FormBasic: FC<Props> = ({
  models,
  onAddProductVariation,
  onChangeProductModel,
  errors,
}) => {
  const handlePriceChange = (value: string) => {
    const newModel = {
      ...models[0],
      price: Number(value),
    };
    onChangeProductModel(newModel, 0);
  };

  return (
    <Form labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} colon={false}>
      <Form.Item label="Phân loại hàng">
        <Button
          type="dashed"
          block
          icon={<PlusCircleOutlined />}
          onClick={onAddProductVariation}
        >
          Thêm nhóm phân loại
        </Button>
      </Form.Item>
      <Form.Item
        label="Giá"
        required
        validateStatus={errors.price ? "error" : ""}
        help={errors.price}
      >
        <InputNumber
          value={models[0].price.toString()}
          onChange={handlePriceChange}
          addonBefore="đ"
          placeholder="Nhập vào"
        />
      </Form.Item>
      <Form.Item
        label="Kho hàng"
        required
        validateStatus={errors.stock ? "error" : ""}
        help={errors.stock}
      >
        <SettingInventory
          model={models[0]}
          onChangeProductModel={onChangeProductModel}
          modelPosition={0}
        />
      </Form.Item>
    </Form>
  );
};

export default FormBasic;
