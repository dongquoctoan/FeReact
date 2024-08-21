import { Form, Input, Modal, Select } from "antd";
import { ProductAttribute } from "constants/types/productAttribute.type";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FC, useEffect } from "react";

type Props = {
  okText: string;
  productAttributeSelected?: ProductAttribute;
  visible: boolean;
  onCancel: () => void;
  onSubmit: (data: any) => void;
};

type FormControlProductAttributeValue = {
  name: string;
  values: Array<string>;
};
const initialValues: FormControlProductAttributeValue = {
  name: "",
  values: [],
};

const formControllProductAttributeSchema = Yup.object().shape({
  name: Yup.string().required("Tên thuộc tính không được để trống"),
  values: Yup.array().min(1, "Thuộc tính phải có ít nhất một giá trị"),
});

const ModalControlProductAttribute: FC<Props> = ({
  okText,
  visible,
  productAttributeSelected,
  onCancel,
  onSubmit,
}) => {
  const formFilter = useFormik({
    initialValues,
    validationSchema: formControllProductAttributeSchema,
    onSubmit: (data: any) => {
        //console.log(data);
      onSubmit(data);
      formFilter.resetForm();
    },
  });

  useEffect(() => {
    if (visible && productAttributeSelected) {
      const { name, values } = productAttributeSelected;
      formFilter.setValues({
        name,
        values: values.map((item) => item.value),
      });
    }
  }, [visible, productAttributeSelected]);

  // resetform after close
  useEffect(() => {
    if (!visible) formFilter.resetForm();
  }, [visible]);

  return (
    <Modal
      visible={visible}
      centered
      onOk={formFilter.submitForm}
      onCancel={onCancel}
      okText={okText}
    >
      <Form layout="vertical">
        <Form.Item
          label="Tên thuộc tính"
          validateStatus={
            formFilter.errors.name && formFilter.touched.name ? "error" : ""
          }
          help={
            formFilter.errors.name && formFilter.touched.name
              ? formFilter.errors.name
              : null
          }
        >
          <Input
            placeholder="VD: Hãng, Xuất xứ, ..."
            name="name"
            value={formFilter.values.name}
            onChange={formFilter.handleChange}
          />
        </Form.Item>
        <Form.Item
          label="Giá trị"
          validateStatus={
            formFilter.errors.values && formFilter.touched.values ? "error" : ""
          }
          help={
            formFilter.errors.values && formFilter.touched.values
              ? formFilter.errors.values
              : ""
          }
        >
          <Select
            mode="tags"
            style={{ width: "100%" }}
            placeholder="Dell, MacOS, Trung Quốc, Nhật Bản, ..."
            onChange={(values: string[]) => {
              formFilter.setFieldValue("values", values);
            }}
            value={formFilter.values.values}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalControlProductAttribute;
