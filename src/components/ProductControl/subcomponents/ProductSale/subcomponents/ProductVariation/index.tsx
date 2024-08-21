/* eslint-disable react/display-name */
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Form, Input, Space } from "antd";
import { ErrorProductControl } from "components/ProductControl/hooks/useProductControl";
import { ProductVariation as ProductVariationType } from "constants/types/product.type";
import { ChangeEvent, FC } from "react";
import styles from "components/ProductControl/subcomponents/ProductSale/subcomponents/ProductVariation/ProductVariation.module.css";

type Props = {
  onRemove: (index: number) => void;
  value: ProductVariationType;
  position: number;
  errors: ErrorProductControl;
  onChange: (variation: ProductVariationType, position: number) => void;
};

const ProductVariation: FC<Props> = ({
  onRemove,
  value: variation,
  position,
  errors,
  onChange,
}) => {
  const handleNameChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;
    const newVariation = {
      ...variation,
      name: value,
    };

    onChange(newVariation, position);
  };

  const handleAddOption = () => {
    const newVariation = { ...variation, options: [...variation.options, ""] };
    onChange(newVariation, position);
  };

  const handleRemoveOption = (indexRemoved: number) => {
    const newOptions = [...variation.options];
    newOptions.splice(indexRemoved, 1);
    const newVariation = {
      ...variation,
      options: newOptions,
    };

    onChange(newVariation, position);
  };

  const handleOptionChange = (
    evt: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = evt.target;
    const newOptions = [...variation.options];
    newOptions.splice(index, 1, value);
    const newVariation = {
      ...variation,
      options: newOptions,
    };

    onChange(newVariation, position);
  };

  return (
    <div className={styles.wrapper}>
      <Form labelWrap labelCol={{ span: 2 }} colon={false}>
        <Form.Item
          label="Tên nhóm phân loại"
          validateStatus={
            errors.variations && errors.variations[position].name ? "error" : ""
          }
          help={errors.variations && errors.variations[position].name}
        >
          <Input
            placeholder="Nhập tên Nhóm phân loại hàng, ví dụ: màu sắc, kích thước v.v"
            value={variation.name}
            onChange={handleNameChange}
          />
        </Form.Item>
        <Form.Item label="Phân loại hàng">
          <Form.List name="options">
            {() => (
              <>
                <Space direction="vertical" style={{ width: "100%" }}>
                  {variation.options.map((option, index) => (
                    <Form.Item
                      key={index}
                      style={{ marginBottom: 0 }}
                      validateStatus={
                        errors.variations &&
                        errors.variations[position].options[index]
                          ? "error"
                          : ""
                      }
                      help={
                        errors.variations &&
                        errors.variations[position].options[index]
                      }
                    >
                      <div className={styles.option}>
                        <Input
                          placeholder="Nhập phân loại"
                          value={option}
                          onChange={(evt) => handleOptionChange(evt, index)}
                        />
                        <>
                          {variation.options.length >= 2 && (
                            <DeleteOutlined
                              onClick={() => handleRemoveOption(index)}
                            />
                          )}
                        </>
                      </div>
                    </Form.Item>
                  ))}
                  <Button
                    type="dashed"
                    block
                    icon={<PlusCircleOutlined />}
                    onClick={handleAddOption}
                  >
                    Thêm phân loại hàng
                  </Button>
                </Space>
              </>
            )}
          </Form.List>
        </Form.Item>
      </Form>
      <div>
        <Button
          icon={<DeleteOutlined />}
          danger
          onClick={() => onRemove(position)}
        >
          Xóa
        </Button>
      </div>
    </div>
  );
};

export default ProductVariation;
