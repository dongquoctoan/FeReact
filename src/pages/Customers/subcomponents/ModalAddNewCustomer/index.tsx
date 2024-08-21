import { Alert, DatePicker, Form, Input, message, Modal } from "antd";
import Checkbox, { CheckboxChangeEvent } from "antd/lib/checkbox";
import { useFormik } from "formik";
import { FC, useEffect, useState } from "react";
import { generatePassword } from "utils/generatePassword";
import * as Yup from "yup";
import {
  isValidEmail,
  isValidPassword,
  isValidPhoneNumber,
  isValidUserName,
} from "utils/validate";
import { CopyOutlined } from "@ant-design/icons";
import { customerApi } from "apis/customer";
import moment from "moment";

type Props = {
  visible?: boolean;
  onCancel: () => void;
  onSuccess: () => void;
};

const schemaAddNewCustomer = Yup.object().shape({
  first_name: Yup.string().required("Họ người dùng không được để trống."),
  last_name: Yup.string().required("Tên người dùng không được để trống."),
  username: Yup.string()
    .required("Vui lòng nhập tên đăng nhập.")
    .test("validateUsername", "Tên đăng nhập không hợp lệ.", (username) => {
      if (username) {
        return isValidUserName(username);
      }
      return false;
    }),
  password: Yup.string().test(
    "validatePassword",
    "Mật khẩu không hợp lệ.",
    (password) => {
      if (password) {
        return isValidPassword(password);
      }
      return false;
    }
  ),
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
});

const ModalAddNewCustomer: FC<Props> = ({ visible, onCancel, onSuccess }) => {
  const [addNewCustomerError, setAddNewCustomerError] = useState<string>("");

  const formAddNewCustomer = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      date_of_birth: null,
    },
    validationSchema: schemaAddNewCustomer,
    onSubmit: async (data) => {
      try {
        await customerApi.create(data);
        setAddNewCustomerError("");
        message.success("Thêm mới tài khoản khách hàng thành công");
        onSuccess();
        onCancel();
      } catch (error: any) {
        setAddNewCustomerError(error.response.data.error.message);
        setIsAutoFillPassword(false);
        formAddNewCustomer.resetForm();
      }
    },
  });

  const handleChangeDateOfBirth = (dates: any, dateString: any) => {
    formAddNewCustomer.setValues({
      ...formAddNewCustomer.values,
      date_of_birth: dateString,
    });
  };

  const [isAutoFillPassword, setIsAutoFillPassword] = useState<boolean>(false);
  const handleChangeAutoFillPassword = (e: CheckboxChangeEvent) => {
    setIsAutoFillPassword(e.target.checked);
    if (e.target.checked === true) {
      const randomPassword = generatePassword(3);
      formAddNewCustomer.setValues({
        ...formAddNewCustomer.values,
        password: randomPassword,
      });
    } else {
      formAddNewCustomer.setValues({
        ...formAddNewCustomer.values,
        password: "",
      });
    }
  };

  const handleCopyPasswordToClipboard = () => {
    navigator.clipboard.writeText(formAddNewCustomer.values.password);
    message.success("Đã sao chép mật khẩu.");
  };

  // reset form after close
  useEffect(() => {
    if (!visible) {
      formAddNewCustomer.resetForm();
      setIsAutoFillPassword(false);
      setAddNewCustomerError("");
    }
  }, [visible]);
  //////

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      okText="Tạo"
      onOk={formAddNewCustomer.submitForm}
      confirmLoading={formAddNewCustomer.isSubmitting}
    >
      {addNewCustomerError && (
        <Alert
          message={addNewCustomerError}
          type="error"
          style={{ marginBottom: 16 }}
        />
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
              formAddNewCustomer.errors.first_name &&
              formAddNewCustomer.touched.first_name
                ? "error"
                : ""
            }
            help={
              formAddNewCustomer.errors.first_name &&
              formAddNewCustomer.touched.first_name
                ? formAddNewCustomer.errors.first_name
                : null
            }
          >
            <Input
              placeholder="Họ"
              name="first_name"
              value={formAddNewCustomer.values.first_name}
              onChange={formAddNewCustomer.handleChange}
              onBlur={formAddNewCustomer.handleBlur}
            />
          </Form.Item>
          <Form.Item
            style={{
              display: "inline-block",
              width: "calc(50% - 4px)",
              marginLeft: "4px",
            }}
            validateStatus={
              formAddNewCustomer.errors.last_name &&
              formAddNewCustomer.touched.last_name
                ? "error"
                : ""
            }
            help={
              formAddNewCustomer.errors.last_name &&
              formAddNewCustomer.touched.last_name
                ? formAddNewCustomer.errors.last_name
                : null
            }
          >
            <Input
              placeholder="Tên"
              name="last_name"
              value={formAddNewCustomer.values.last_name}
              onBlur={formAddNewCustomer.handleBlur}
              onChange={formAddNewCustomer.handleChange}
            />
          </Form.Item>
          <Form.Item
            label="Tên đăng nhập"
            validateStatus={
              formAddNewCustomer.errors.username &&
              formAddNewCustomer.touched.username
                ? "error"
                : ""
            }
            help={
              formAddNewCustomer.errors.username &&
              formAddNewCustomer.touched.username
                ? formAddNewCustomer.errors.username
                : null
            }
          >
            <Input
              name="username"
              value={formAddNewCustomer.values.username}
              onChange={formAddNewCustomer.handleChange}
              onBlur={formAddNewCustomer.handleBlur}
            />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            validateStatus={
              formAddNewCustomer.errors.password &&
              formAddNewCustomer.touched.password
                ? "error"
                : ""
            }
            help={
              formAddNewCustomer.errors.password &&
              formAddNewCustomer.touched.password
                ? formAddNewCustomer.errors.password
                : null
            }
          >
            <Form.Item
              style={{
                display: "inline-block",
                width: "calc(50% - 4px)",
                marginRight: "4px",
                marginBottom: "0px",
              }}
            >
              <Input.Password
                placeholder="Nhập vào"
                name="password"
                value={formAddNewCustomer.values.password}
                onChange={formAddNewCustomer.handleChange}
                onBlur={formAddNewCustomer.handleBlur}
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
                marginBottom: "0px",
              }}
            >
              <Checkbox
                checked={isAutoFillPassword}
                onChange={handleChangeAutoFillPassword}
              >
                Mật khẩu ngẫu nhiên
              </Checkbox>
            </Form.Item>
          </Form.Item>
          <Form.Item
            label="Địa chỉ email"
            validateStatus={
              formAddNewCustomer.errors.email &&
              formAddNewCustomer.touched.email
                ? "error"
                : ""
            }
            help={
              formAddNewCustomer.errors.email &&
              formAddNewCustomer.touched.email
                ? formAddNewCustomer.errors.email
                : null
            }
          >
            <Input
              type="email"
              placeholder="VD: example@gmail.com"
              name="email"
              value={formAddNewCustomer.values.email}
              onChange={formAddNewCustomer.handleChange}
              onBlur={formAddNewCustomer.handleBlur}
            />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            validateStatus={
              formAddNewCustomer.errors.phone &&
              formAddNewCustomer.touched.phone
                ? "error"
                : ""
            }
            help={
              formAddNewCustomer.errors.phone &&
              formAddNewCustomer.touched.phone
                ? formAddNewCustomer.errors.phone
                : null
            }
          >
            <Input
              placeholder="VD: 0334455667"
              name="phone"
              value={formAddNewCustomer.values.phone}
              onChange={formAddNewCustomer.handleChange}
              onBlur={formAddNewCustomer.handleBlur}
            />
          </Form.Item>
          <Form.Item label="Ngày sinh" hasFeedback>
            <DatePicker
              format="DD/MM/YYYY"
              value={
                formAddNewCustomer.values.date_of_birth
                  ? moment(
                      formAddNewCustomer.values.date_of_birth,
                      "DD/MM/YYYY"
                    )
                  : undefined
              }
              style={{ width: "100%" }}
              onChange={handleChangeDateOfBirth}
            />
          </Form.Item>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalAddNewCustomer;
