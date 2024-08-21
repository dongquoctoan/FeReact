import { CopyOutlined } from "@ant-design/icons";
import { Alert, Checkbox, Form, Input, message, Modal, Select } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { RootState } from "configs/configureStore";
import { User } from "constants/types/user.type";
import { useFormik } from "formik";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { generatePassword } from "utils/generatePassword";
import {
  isValidEmail,
  isValidPassword,
  isValidPhoneNumber,
  isValidUserName,
} from "utils/validate";
import * as Yup from "yup";

type FormControlValue = {
  first_name: string;
  last_name: string;
  username: string;
  password?: string;
  email: string;
  phone: string;
  roles: Array<string>;
};

type Props = {
  visible?: boolean;
  onCancel: () => void;
  user?: User;
  onSubmit: (data: any) => void;
  okText: string;
  error?: string;
  hidePassword?: boolean;
};

const { Option } = Select;

const ModalControlUser: FC<Props> = ({
  visible,
  onCancel,
  user,
  onSubmit,
  okText,
  error,
  hidePassword,
}) => {
  const { rolesSelection } = useSelector((state: RootState) => state.appSlice);

  const initialValues: FormControlValue = {
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone: "",
    roles: [],
  };

  const schema: any = {};

  if (!hidePassword) {
    schema.password = Yup.string().test(
      "validatePassword",
      "Mật khẩu không hợp lệ.",
      (password) => {
        if (password) {
          return isValidPassword(password);
        }
        return false;
      }
    );
    initialValues.password = "";
  }

  const formControlUserSchema = Yup.object().shape({
    first_name: Yup.string().required("Họ người dùng không được để trống."),
    last_name: Yup.string().required("Tên người dùng không được để trống."),
    username: Yup.string()
      .required("Tên đăng nhập không được để trống.")
      .test("validateUsername", "Tên đăng nhập không hợp lệ.", (username) => {
        if (username) {
          return isValidUserName(username);
        }
        return false;
      }),
    email: Yup.string().test(
      "validateEmail",
      "Địa chỉ email không hợp lệ.",
      (email) => {
        if (email) {
          return isValidEmail(email);
        }
        return false;
      }
    ),
    phone: Yup.string().test(
      "validatePhoneNumber",
      "Số điện thoại không hợp lệ.",
      (phone) => {
        if (phone) {
          return isValidPhoneNumber(phone);
        }
        return false;
      }
    ),
    roles: Yup.array().min(1, "Nhóm người dùng không được để trống."),
    ...schema,
  });

  const formControlUser = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      username: "",
      password: "",
      email: "",
      phone: "",
      roles: [] as Array<string>,
    },
    validationSchema: formControlUserSchema,
    onSubmit: (data) => {
      onSubmit(data);
    },
  });

  useEffect(() => {
    formControlUser.resetForm();
    setIsRandomPassword(false);
  }, [error]);

  useEffect(() => {
    if (visible && user) {
      const roles: Array<string> = (user.roles || []).map((role) => role._id);
      const { first_name, last_name, username, email, phone } = user;
      formControlUser.setValues({
        first_name,
        last_name,
        username,
        email,
        phone,
        roles,
        password: "",
      });
    }
  }, [user, visible]);

  // handle random password
  const [isRandomPassword, setIsRandomPassword] = useState<boolean>(false);

  const handleRandomPassword = (evt: CheckboxChangeEvent) => {
    const { checked } = evt.target;
    setIsRandomPassword(checked);
    if (checked) {
      const randomPassword = generatePassword();
      formControlUser.setFieldValue("password", randomPassword);
    } else {
      formControlUser.setFieldValue("password", "");
    }
  };

  const handleCopyPasswordToClipboard = () => {
    navigator.clipboard.writeText(formControlUser.values.password);
    message.success("Đã sao chép mật khẩu.");
  };

  // reset form after close
  useEffect(() => {
    if (!visible) {
      formControlUser.resetForm();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      okText={okText}
      onOk={formControlUser.submitForm}
      confirmLoading={formControlUser.isSubmitting}
    >
      {error && (
        <Alert message={error} type="error" style={{ marginBottom: 16 }} />
      )}
      <Form layout="vertical">
        <Form.Item label="Tên người dùng" style={{ marginBottom: 0 }}>
          <Form.Item
            style={{
              display: "inline-block",
              width: "calc(50% - 4px)",
              marginRight: "4px",
            }}
            validateStatus={
              formControlUser.errors.first_name &&
              formControlUser.touched.first_name
                ? "error"
                : ""
            }
            help={
              formControlUser.errors.first_name &&
              formControlUser.touched.first_name
                ? formControlUser.errors.first_name
                : null
            }
          >
            <Input
              placeholder="Họ"
              name="first_name"
              value={formControlUser.values.first_name}
              onChange={formControlUser.handleChange}
            />
          </Form.Item>
          <Form.Item
            style={{
              display: "inline-block",
              width: "calc(50% - 4px)",
              marginLeft: "4px",
            }}
            validateStatus={
              formControlUser.errors.last_name &&
              formControlUser.touched.last_name
                ? "error"
                : ""
            }
            help={
              formControlUser.errors.last_name &&
              formControlUser.touched.last_name
                ? formControlUser.errors.last_name
                : null
            }
          >
            <Input
              placeholder="Tên"
              name="last_name"
              value={formControlUser.values.last_name}
              onChange={formControlUser.handleChange}
            />
          </Form.Item>
        </Form.Item>
        <Form.Item
          label="Tên đăng nhập"
          validateStatus={
            formControlUser.errors.username && formControlUser.touched.username
              ? "error"
              : ""
          }
          help={
            formControlUser.errors.username && formControlUser.touched.username
              ? formControlUser.errors.username
              : null
          }
        >
          <Input
            type="username"
            placeholder="Nhập vào"
            name="username"
            value={formControlUser.values.username}
            onChange={formControlUser.handleChange}
          />
        </Form.Item>
        {!hidePassword && (
          <Form.Item label="Mật khẩu" style={{ marginBottom: 0 }}>
            <Form.Item
              style={{
                display: "inline-block",
                width: "calc(50% - 4px)",
                marginRight: "4px",
              }}
              validateStatus={
                formControlUser.errors.password &&
                formControlUser.touched.password
                  ? "error"
                  : ""
              }
              help={
                formControlUser.errors.password &&
                formControlUser.touched.password
                  ? formControlUser.errors.password
                  : null
              }
            >
              <Input
                placeholder="Nhập vào"
                type="password"
                name="password"
                value={formControlUser.values.password}
                onChange={formControlUser.handleChange}
                addonAfter={
                  <CopyOutlined
                    style={{ cursor: "pointer" }}
                    onClick={handleCopyPasswordToClipboard}
                  />
                }
              />
            </Form.Item>
            <Form.Item
              style={{
                display: "inline-block",
                width: "calc(50% - 4px)",
                marginLeft: "4px",
              }}
            >
              <Checkbox
                checked={isRandomPassword}
                onChange={handleRandomPassword}
              >
                Mật khẩu ngẫu nhiên
              </Checkbox>
            </Form.Item>
          </Form.Item>
        )}
        <Form.Item
          label="Địa chỉ email"
          validateStatus={
            formControlUser.errors.email && formControlUser.touched.email
              ? "error"
              : ""
          }
          help={
            formControlUser.errors.email && formControlUser.touched.email
              ? formControlUser.errors.email
              : null
          }
        >
          <Input
            type="email"
            placeholder="VD: example@gmail.com"
            name="email"
            value={formControlUser.values.email}
            onChange={formControlUser.handleChange}
          />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          validateStatus={
            formControlUser.errors.phone && formControlUser.touched.phone
              ? "error"
              : ""
          }
          help={
            formControlUser.errors.phone && formControlUser.touched.phone
              ? formControlUser.errors.phone
              : null
          }
        >
          <Input
            placeholder="VD: 0334455667"
            name="phone"
            value={formControlUser.values.phone}
            onChange={formControlUser.handleChange}
          />
        </Form.Item>
        <Form.Item
          label="Nhóm người dùng"
          validateStatus={
            formControlUser.errors.roles && formControlUser.touched.roles
              ? "error"
              : ""
          }
          help={
            formControlUser.errors.roles && formControlUser.touched.roles
              ? formControlUser.errors.roles
              : null
          }
        >
          <Select
            mode="multiple"
            value={formControlUser.values.roles}
            onChange={(value) => formControlUser.setFieldValue("roles", value)}
            placeholder="Chọn nhóm người dùng"
          >
            {rolesSelection.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalControlUser;
