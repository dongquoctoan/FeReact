import { Alert, Form, Input, Modal } from "antd";
import { Role } from "constants/types/role.type";
import { useFormik } from "formik";
import { FC, useEffect } from "react";
import * as Yup from "yup";

type Props = {
  visible?: boolean;
  onCancel: () => void;
  role?: Role;
  onSubmit: (data: any) => void;
  error?: string;
  okText: string;
};

const schemaEditRole = Yup.object().shape({
  code: Yup.string().required("Mã nhóm quyền không được để trống."),
  name: Yup.string().required("Tên nhóm quyền không được để trống."),
});

const ModalControlRole: FC<Props> = ({
  visible,
  onCancel,
  role,
  onSubmit,
  error,
  okText,
}) => {
  const formControlRole = useFormik({
    initialValues: {
      name: "",
      code: "",
      description: "",
    },
    validationSchema: schemaEditRole,
    onSubmit: (data) => {
      onSubmit(data);
    },
  });

  useEffect(() => {
    if (visible && role) {
      const { code, description, name } = role;
      formControlRole.setValues({
        code,
        description,
        name,
      });
    }
  }, [role, visible]);

  // reset form after close
  useEffect(() => {
    if (!visible) formControlRole.resetForm();
  }, [visible]);

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      okText={okText}
      onOk={formControlRole.submitForm}
      confirmLoading={formControlRole.isSubmitting}
    >
      {error && (
        <Alert message={error} type="error" style={{ marginBottom: 16 }} />
      )}
      <Form layout="vertical">
        <Form.Item
          label="Mã nhóm quyền"
          validateStatus={
            formControlRole.errors.code && formControlRole.touched.code
              ? "error"
              : ""
          }
          help={
            formControlRole.errors.code && formControlRole.touched.code
              ? formControlRole.errors.code
              : null
          }
        >
          <Input
            name="code"
            placeholder="VD: ke_toan"
            value={formControlRole.values.code}
            onChange={formControlRole.handleChange}
            onBlur={formControlRole.handleBlur}
          />
        </Form.Item>
        <Form.Item
          label="Tên nhóm quyền"
          validateStatus={
            formControlRole.errors.name && formControlRole.touched.name
              ? "error"
              : ""
          }
          help={
            formControlRole.errors.name && formControlRole.touched.name
              ? formControlRole.errors.name
              : null
          }
        >
          <Input
            name="name"
            placeholder="VD: Nhóm kế toán"
            value={formControlRole.values.name}
            onChange={formControlRole.handleChange}
            onBlur={formControlRole.handleBlur}
          />
        </Form.Item>
        <Form.Item label="Mô tả">
          <Input.TextArea
            name="description"
            placeholder="Mô tả về nhóm quyền"
            value={formControlRole.values.description}
            onChange={formControlRole.handleChange}
            onBlur={formControlRole.handleBlur}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalControlRole;
