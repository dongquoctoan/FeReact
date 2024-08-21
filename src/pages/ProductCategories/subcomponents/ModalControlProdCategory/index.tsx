import { Alert, Form, Input, Modal } from "antd";
import InputNumber from "components/InputNumber";
import InputSelectProductCategory from "components/InputSelectProductCategory";
import UploadImages from "components/UploadImages";
import { ProductCategory } from "constants/types/productCategory.type";
import { useFormik } from "formik";
import { FC, useEffect } from "react";
import * as Yup from "yup";

export type FormControlProdCategoryValue = {
  name: string;
  description: string;
  image: string;
  parent_category_ids: Array<string>;
  //affiliate_percent: number | null;
  affiliate_percent_collaborator: number | null;
  affiliate_percent_customer: number | null;
};

type Props = {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (data: FormControlProdCategoryValue) => void;
  category?: ProductCategory;
  error?: string;
  okText?: string;
};

const formControlProdCategorySchema = Yup.object().shape({
  name: Yup.string().trim().required("Tên danh mục không được để trống."),
  description: Yup.string()
    .trim()
    .required("Mô tả danh mục không được để trống."),
  affiliate_percent_collaborator: Yup.number()
    .nullable()
    .max(99, "Giá trị không được vượt quá 100%"),
  affiliate_percent_customer: Yup.number()
    .nullable()
    .max(99, "Giá trị không được vượt quá 100%"),
});

const ModalControlProdCategory: FC<Props> = ({
  visible,
  onCancel,
  onSubmit,
  error,
  category,
  okText,
}) => {
  const initValue: FormControlProdCategoryValue = {
    name: "",
    description: "",
    parent_category_ids: [] as Array<string>,
    image: "",
    affiliate_percent_collaborator: null,
    affiliate_percent_customer: null,
  };

  const formControlProdCategory = useFormik({
    initialValues: initValue,
    validationSchema: formControlProdCategorySchema,
    onSubmit: (data) => {
      //console.log(data);
      onSubmit(data);
    },
  });

  const handleSelectParentProductCategory = (
    categoryIdsSelected: Array<string>
  ) => {
    formControlProdCategory.setFieldValue(
      "parent_category_ids",
      categoryIdsSelected
    );
  };

  const handleChangeAffiliatePercentCollaborator = (value: any) => {
    formControlProdCategory.setFieldValue(
      "affiliate_percent_collaborator",
      value ? Number(value) : null
    );
  };

  const handleChangeAffiliatePercentCustomer = (value: any) => {
    formControlProdCategory.setFieldValue(
      "affiliate_percent_customer",
      value ? Number(value) : null
    );
  };

  useEffect(() => {
    if (visible && category) {
      formControlProdCategory.setValues({
        name: category.name,
        description: category.description,
        parent_category_ids: category.parent_category_path,
        image: category.image,
        affiliate_percent_collaborator: category.affiliate_percent_collaborator,
        affiliate_percent_customer: category.affiliate_percent_customer,
      });
    }
  }, [category, visible]);

  useEffect(() => {
    if (!visible) {
      formControlProdCategory.resetForm();
    }
  }, [visible]);

  return (
    <>
      <Modal
        visible={visible}
        onCancel={onCancel}
        okText={okText}
        onOk={formControlProdCategory.submitForm}
        width={450}
      >
        {error && (
          <Alert type="error" message={error} style={{ marginBottom: 16 }} />
        )}
        <Form layout="vertical">
          <Form.Item
            label="Tên danh mục"
            validateStatus={
              formControlProdCategory.errors.name &&
              formControlProdCategory.touched.name
                ? "error"
                : ""
            }
            help={
              formControlProdCategory.errors.name &&
              formControlProdCategory.touched.name
                ? formControlProdCategory.errors.name
                : null
            }
          >
            <Input
              placeholder="VD: Quần Jean"
              name="name"
              value={formControlProdCategory.values.name}
              onChange={formControlProdCategory.handleChange}
            />
          </Form.Item>
          <Form.Item
            label="Mô tả danh mục"
            validateStatus={
              formControlProdCategory.errors.description &&
              formControlProdCategory.touched.description
                ? "error"
                : ""
            }
            help={
              formControlProdCategory.errors.description &&
              formControlProdCategory.touched.description
                ? formControlProdCategory.errors.description
                : null
            }
          >
            <Input
              placeholder="VD: Danh mục dành cho sản phẩm quần Jean"
              name="description"
              value={formControlProdCategory.values.description}
              onChange={formControlProdCategory.handleChange}
            />
          </Form.Item>
          <Form.Item label="Danh mục cha">
            <InputSelectProductCategory
              categoryIds={formControlProdCategory.values.parent_category_ids}
              onChange={handleSelectParentProductCategory}
              placeholder="Lựa chọn danh mục cha"
            />
          </Form.Item>
          <Form.Item
            label="Hoa hồng CTV"
            validateStatus={
              formControlProdCategory.errors.affiliate_percent_collaborator &&
              formControlProdCategory.touched.affiliate_percent_collaborator
                ? "error"
                : ""
            }
            help={
              formControlProdCategory.errors.affiliate_percent_collaborator &&
              formControlProdCategory.touched.affiliate_percent_collaborator
                ? formControlProdCategory.errors.affiliate_percent_collaborator
                : null
            }
          >
            <InputNumber
              placeholder="Nhập số hoa hồng được hưởng (VD: 5)"
              name="affiliate_percent_collaborator"
              value={
                formControlProdCategory.values.affiliate_percent_collaborator
                  ? formControlProdCategory.values.affiliate_percent_collaborator.toString()
                  : ""
              }
              onChange={handleChangeAffiliatePercentCollaborator}
              addonAfter="%"
              allowNegative={false}
            />
          </Form.Item>
          <Form.Item
            label="% Giảm giá SP"
            validateStatus={
              formControlProdCategory.errors.affiliate_percent_customer &&
              formControlProdCategory.touched.affiliate_percent_customer
                ? "error"
                : ""
            }
            help={
              formControlProdCategory.errors.affiliate_percent_customer &&
              formControlProdCategory.touched.affiliate_percent_customer
                ? formControlProdCategory.errors.affiliate_percent_customer
                : null
            }
          >
            <InputNumber
              placeholder="Nhập số % giảm giá cho danh mục (VD: 5)"
              name="affiliate_percent_customer"
              value={
                formControlProdCategory.values.affiliate_percent_customer
                  ? formControlProdCategory.values.affiliate_percent_customer.toString()
                  : ""
              }
              onChange={handleChangeAffiliatePercentCustomer}
              addonAfter="%"
              allowNegative={false}
            />
          </Form.Item>
          <Form.Item label="Hình ảnh">
            <UploadImages
              value={
                formControlProdCategory.values.image
                  ? [formControlProdCategory.values.image]
                  : []
              }
              onChange={(images) =>
                formControlProdCategory.setFieldValue("image", images[0])
              }
              multiple={false}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalControlProdCategory;
