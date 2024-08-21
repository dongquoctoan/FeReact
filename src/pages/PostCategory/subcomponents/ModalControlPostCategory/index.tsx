import { Alert, Form, Input, Modal } from "antd";
import { PostCategory } from "constants/types/postCategory.type";
import { useFormik } from "formik";
import { FC, useEffect } from "react";
import * as Yup from "yup";

export type FormControlPostCategoryValue = {
  name: string;
  description: string;
};

type Props = {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (data: FormControlPostCategoryValue) => void;
  category?: PostCategory;
  error?: string;
  okText?: string;
};

const formControlPostCategorySchema = Yup.object().shape({
  name: Yup.string().trim().required("Tên danh mục không được để trống."),
  description: Yup.string()
    .trim()
    .required("Mô tả danh mục không được để trống."),
});

const ModalControlPostCategory: FC<Props> = ({
  visible,
  onCancel,
  onSubmit,
  error,
  category,
  okText,
}) => {
  const formControlPostCategory = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: formControlPostCategorySchema,
    onSubmit: (data) => {
      onSubmit(data);
    },
  });

  useEffect(() => {
    if (visible && category) {
      formControlPostCategory.setValues({
        name: category.name,
        description: category.description,
      });
    }
  }, [category, visible]);

  useEffect(() => {
    if (!visible) {
      formControlPostCategory.resetForm();
    }
  }, [visible]);

  return (
    <>
      <Modal
        visible={visible}
        onCancel={onCancel}
        okText={okText}
        onOk={formControlPostCategory.submitForm}
        width={450}
      >
        {error && (
          <Alert type="error" message={error} style={{ marginBottom: 16 }} />
        )}
        <Form layout="vertical">
          <Form.Item
            label="Tên danh mục"
            validateStatus={
              formControlPostCategory.errors.name &&
              formControlPostCategory.touched.name
                ? "error"
                : ""
            }
            help={
              formControlPostCategory.errors.name &&
              formControlPostCategory.touched.name
                ? formControlPostCategory.errors.name
                : null
            }
          >
            <Input
              placeholder="VD: Hướng dẫn piano"
              name="name"
              value={formControlPostCategory.values.name}
              onChange={formControlPostCategory.handleChange}
            />
          </Form.Item>
          <Form.Item
            label="Mô tả danh mục"
            validateStatus={
              formControlPostCategory.errors.description &&
              formControlPostCategory.touched.description
                ? "error"
                : ""
            }
            help={
              formControlPostCategory.errors.description &&
              formControlPostCategory.touched.description
                ? formControlPostCategory.errors.description
                : null
            }
          >
            <Input.TextArea
              placeholder="VD: Danh mục dành cho tin bài về piano"
              name="description"
              value={formControlPostCategory.values.description}
              onChange={formControlPostCategory.handleChange}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalControlPostCategory;
