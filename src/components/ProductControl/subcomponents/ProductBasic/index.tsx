import { Card, Form, Input } from "antd";
import CardTitle from "components/CardTitle";
import InputSelectProductCategory from "components/InputSelectProductCategory";
import {
  ErrorProductControl,
  ProductBasicData,
} from "components/ProductControl/hooks/useProductControl";
import UploadImages from "components/UploadImages";
import React, { ChangeEvent, FC } from "react";
import RichTextEditor from "components/ProductControl/subcomponents/ProductBasic/subcomponents/RichTextEditor";

type Props = {
  images: Array<string>;
  videos: Array<string>;
  name: string;
  description: string;
  product_category_path: Array<string>;
  errors: ErrorProductControl;
  onChange: (basicData: ProductBasicData) => void;
};

const ProductBasic: FC<Props> = ({
  images,
  name,
  description,
  product_category_path,
  onChange,
  errors,
}) => {
  const handleProductNameChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;
    onChange({ name: value });
  };

  const handleProductDescChange = (value: any) => {
    onChange({ description: value });
  };

  const handleImagesChange = (imageUrls: Array<string>) => {
    onChange({ images: imageUrls });
  };

  const handleSelectParentProductCategory = (
    categoryIdsSelected: Array<string>
  ) => {
    const categoryId = categoryIdsSelected[categoryIdsSelected.length - 1];
    onChange({
      product_category_id: categoryId,
      product_category_path: categoryIdsSelected,
    });
  };

  return (
    <>
      <Card>
        <CardTitle
          title="Thông tin cơ bản"
          subtitle="Bổ sung thông tin cơ bản của sản phẩm. VD: tên sản phẩm, mô tả, ...v...v"
        />
        <Form
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 22 }}
          colon={false}
          labelWrap
        >
          <Form.Item
            label="Hình ảnh sản phẩm"
            validateStatus={errors.images ? "error" : ""}
            help={errors.images}
          >
            <UploadImages
              firstLabel="Ảnh bìa*"
              value={images}
              onChange={handleImagesChange}
              multiple
            />
          </Form.Item>
          <Form.Item
            label="Tên sản phẩm"
            required
            validateStatus={errors.name ? "error" : ""}
            help={errors.name}
          >
            <Input
              placeholder="VD: Quần áo thể thao 7 màu"
              value={name}
              onChange={handleProductNameChange}
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            required
            validateStatus={errors.description ? "error" : ""}
            help={errors.description}
          >
            <RichTextEditor
              value={description}
              onChange={handleProductDescChange}
            />
          </Form.Item>
          <Form.Item
            label="Danh mục"
            required
            validateStatus={errors.product_category_id ? "error" : ""}
            help={errors.product_category_id}
          >
            <InputSelectProductCategory
              categoryIds={product_category_path}
              onChange={handleSelectParentProductCategory}
              placeholder="Lựa chọn danh mục"
            />
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default React.memo(ProductBasic);
