import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Form, Input, Space, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import InputNumber from "components/InputNumber";
import { ErrorProductControl } from "components/ProductControl/hooks/useProductControl";
import ProductVariation from "components/ProductControl/subcomponents/ProductSale/subcomponents/ProductVariation";
import UploadImages from "components/UploadImages";
import {
  ProductModel,
  ProductVariation as ProductVariationType,
} from "constants/types/product.type";
import { ChangeEvent, FC, useMemo } from "react";
import SettingInventory from "../SettingInventory";

type Props = {
  models: Array<ProductModel>;
  variations: Array<ProductVariationType>;
  onAddProductVariation: () => void;
  onRemoveProductVariation: (position: number) => void;
  onChangeProductModel: (model: ProductModel, position: number) => void;
  onChangeProductVariation: (
    variation: ProductVariationType,
    position: number
  ) => void;
  errors: ErrorProductControl;
};

const FormAdvanced: FC<Props> = ({
  variations,
  models,
  errors,
  onAddProductVariation,
  onRemoveProductVariation,
  onChangeProductVariation,
  onChangeProductModel,
}) => {
  const handleSKUModelChange = (
    evt: ChangeEvent<HTMLInputElement>,
    model: ProductModel,
    position: number
  ) => {
    const { value } = evt.target;
    const newModel = {
      ...model,
      sku: value,
    };
    onChangeProductModel(newModel, position);
  };

  const handlePriceModelChange = (
    value: string,
    model: ProductModel,
    position: number
  ) => {
    const newModel = {
      ...model,
      price: Number(value),
    };
    onChangeProductModel(newModel, position);
  };

  const handleImageVariationChange = (index: number, value: Array<string>) => {
    const newImages = [...variations[0].images];
    newImages.splice(index, 1, value[0]);
    const newVariation = {
      ...variations[0],
      images: newImages,
    };

    onChangeProductVariation(newVariation, 0);
  };

  const columns: ColumnsType<any> = useMemo(() => {
    const result: ColumnsType<any> = [
      {
        title: variations[0].name || "Tên phân loại",
        align: "center",
        dataIndex: "name",
        render: (name: string) => <span>{name.split(",")[0] || "Loại"}</span>,
        onCell: (_, index = 0) => {
          const optionTwoLength = variations[1]
            ? variations[1].options.length
            : 0;
          if (!optionTwoLength) {
            return {};
          }
          if (index % optionTwoLength === 0) {
            return {
              rowSpan: optionTwoLength,
            };
          }
          return {
            rowSpan: 0,
          };
        },
      },
      {
        title: "Giá",
        align: "center",
        dataIndex: "price",
        render: (value: number, item: ProductModel, index: number) => (
          <InputNumber
            bordered={false}
            placeholder="Nhập vào"
            prefix="đ"
            value={value.toString()}
            onChange={(value) => handlePriceModelChange(value, item, index)}
          />
        ),
      },
      {
        title: "Kho hàng",
        align: "center",
        dataIndex: "stock",
        render: (value: number, item: ProductModel, index: number) => (
          <SettingInventory
            model={item}
            onChangeProductModel={onChangeProductModel}
            modelPosition={index}
          />
        ),
      },
      {
        title: "SKU phân loại",
        align: "center",
        dataIndex: "sku",
        render: (value: string, item: ProductModel, index: number) => (
          <Input
            bordered={false}
            value={value}
            onChange={(evt) => handleSKUModelChange(evt, item, index)}
          />
        ),
      },
    ];

    if (variations.length === 2) {
      result.splice(1, 0, {
        title: variations[1].name || "Tên phân loại",
        align: "center",
        dataIndex: "name",
        render: (name: string) => <span>{name.split(",")[1] || "Loại"}</span>,
      });
    }

    return result;
  }, [variations, models]);

  return (
    <Form
      labelCol={{ span: 2 }}
      wrapperCol={{ span: 22 }}
      colon={false}
      labelWrap
    >
      <Form.List name="variations">
        {() => (
          <Space direction="vertical" style={{ width: "100%" }}>
            {variations.map((variation, index) => (
              <Form.Item key={index} label={"Nhóm phân loại " + (index + 1)}>
                <ProductVariation
                  value={variation}
                  onRemove={onRemoveProductVariation}
                  position={index}
                  errors={errors}
                  onChange={onChangeProductVariation}
                />
              </Form.Item>
            ))}
            {variations.length < 2 && (
              <Form.Item label=" ">
                <Button
                  type="dashed"
                  block
                  icon={<PlusCircleOutlined />}
                  onClick={onAddProductVariation}
                >
                  Thêm nhóm phân loại
                </Button>
              </Form.Item>
            )}
          </Space>
        )}
      </Form.List>
      <Form.Item label="Danh sách phân loại hàng">
        <Table
          size="small"
          bordered
          columns={columns}
          dataSource={models}
          pagination={false}
        />
      </Form.Item>
      <Form.Item label={variations[0].name || "Phân loại"}>
        <Space size="large" align="start">
          {variations[0].options.map((option, index: number) => (
            <UploadImages
              key={option}
              label={option}
              value={
                variations[0].images[index] ? [variations[0].images[index]] : []
              }
              onChange={(value) => handleImageVariationChange(index, value)}
            />
          ))}
        </Space>
      </Form.Item>
    </Form>
  );
};

export default FormAdvanced;
