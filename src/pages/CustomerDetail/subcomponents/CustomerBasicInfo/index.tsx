import { EditOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, message, Space } from "antd";
import { customerApi } from "apis/customer";
import InputNumber from "components/InputNumber";
import { useFormik } from "formik";
import moment from "moment";
import useCustomerBasicInfo from "pages/CustomerDetail/hooks/useCustomerBasicInfo";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { isValidEmail, isValidPhoneNumber } from "utils/validate";
import * as Yup from "yup";

const editCustomerSchema = Yup.object().shape({
  first_name: Yup.string().required("Vui lòng nhập họ khách hàng."),
  last_name: Yup.string().required("Vui lòng nhập tên khách hàng."),
  email: Yup.string()
    .required("Vui lòng nhập email khách hàng.")
    .test("validateEmail", "Địa chỉ email không hợp lệ.", (email) => {
      if (email) {
        return isValidEmail(email);
      }
      return false;
    }),
  phone: Yup.string()
    .required("Vui lòng nhập số điện thoại.")
    .test("validatePhone", "Số điện thoại không hợp lệ.", (phone) => {
      if (phone) {
        return isValidPhoneNumber(phone);
      }
      return false;
    }),
});

const CustomerBasicInfo = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { id: customerId } = useParams();

  const { customer } = useCustomerBasicInfo(customerId as any);

  useEffect(() => {
    if (customer) {
      const { first_name, last_name, email, phone, username, date_of_birth } =
        customer;
      const _date_of_birth = moment(date_of_birth).format("DD/MM/YYYY");
      formEditCustomer.setValues({
        first_name,
        last_name,
        email,
        phone,
        username,
        date_of_birth: _date_of_birth,
      });
    }
  }, [customer]);

  const formEditCustomer = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      username: "",
      date_of_birth: "",
    },
    validationSchema: editCustomerSchema,
    validateOnBlur: isEditing,
    onSubmit: async (data) => {
      try {
        if (customerId) await customerApi.update(customerId, data);
        message.success("Sửa thông tin khách hàng thành công");
        setIsEditing(false);
      } catch (error: any) {
        message.error(error.message.error.response);
      }
    },
  });

  const handleChangeDateOfBirth = (dates: any, dateString: string) => {
    formEditCustomer.setFieldValue("date_of_birth", dateString);
  };

  const handleCancelEditCustomer = () => {
    // formEditCustomer.setValues(customer);
    setIsEditing(false);
  };

  return (
    <div>
      {!isEditing && (
        <Button
          type="link"
          size="small"
          icon={<EditOutlined />}
          style={{ marginBottom: 16 }}
          onClick={() => setIsEditing(true)}
        >
          Chỉnh sửa thông tin cơ bản
        </Button>
      )}

      <Form
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 8 }}
        colon={false}
        labelWrap={true}
        onFinish={formEditCustomer.handleSubmit}
      >
        <Form.Item label="Tên khách hàng" style={{ marginBottom: 0 }}>
          <Form.Item
            style={{
              display: "inline-block",
              width: "calc(50% - 4px)",
              marginRight: "4px",
            }}
            validateStatus={
              formEditCustomer.touched.first_name &&
              formEditCustomer.errors.first_name
                ? "error"
                : ""
            }
            help={
              formEditCustomer.touched.first_name &&
              formEditCustomer.errors.first_name
            }
          >
            <Input
              placeholder="Họ"
              name="first_name"
              value={formEditCustomer.values.first_name}
              onChange={formEditCustomer.handleChange}
              onBlur={formEditCustomer.handleBlur}
              readOnly={!isEditing}
            />
          </Form.Item>
          <Form.Item
            style={{
              display: "inline-block",
              width: "calc(50% - 4px)",
              marginLeft: "4px",
            }}
            validateStatus={
              formEditCustomer.touched.last_name &&
              formEditCustomer.errors.last_name
                ? "error"
                : ""
            }
            help={
              formEditCustomer.touched.last_name &&
              formEditCustomer.errors.last_name
            }
          >
            <Input
              placeholder="Tên"
              name="last_name"
              value={formEditCustomer.values.last_name}
              onChange={formEditCustomer.handleChange}
              onBlur={formEditCustomer.handleBlur}
              readOnly={!isEditing}
            />
          </Form.Item>
        </Form.Item>
        <Form.Item label="Tên đăng nhập">
          <Input
            placeholder="Nhập vào"
            name="username"
            value={formEditCustomer.values.username}
            disabled
          />
        </Form.Item>
        <Form.Item
          label="Địa chỉ email"
          validateStatus={
            formEditCustomer.touched.email && formEditCustomer.errors.email
              ? "error"
              : ""
          }
          help={formEditCustomer.touched.email && formEditCustomer.errors.email}
        >
          <Input
            placeholder="Nhập vào"
            type="email"
            name="email"
            value={formEditCustomer.values.email}
            onChange={formEditCustomer.handleChange}
            onBlur={formEditCustomer.handleBlur}
            readOnly={!isEditing}
          />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          validateStatus={
            formEditCustomer.touched.phone && formEditCustomer.errors.phone
              ? "error"
              : ""
          }
          help={formEditCustomer.touched.phone && formEditCustomer.errors.phone}
        >
          <InputNumber
            disableComma
            name="phone"
            value={formEditCustomer.values.phone}
            onChange={(phone) => formEditCustomer.setFieldValue("phone", phone)}
            placeholder="Nhập vào"
            onBlur={formEditCustomer.handleBlur}
            readOnly={!isEditing}
          />
        </Form.Item>
        <Form.Item label="Ngày sinh">
          <DatePicker
            format="DD/MM/YYYY"
            value={
              formEditCustomer.values.date_of_birth
                ? moment(formEditCustomer.values.date_of_birth, "DD/MM/YYYY")
                : undefined
            }
            disabled={!isEditing}
          />
        </Form.Item>
        {isEditing && (
          <Form.Item wrapperCol={{ offset: 2 }}>
            <Space>
              <Button onClick={handleCancelEditCustomer}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
            </Space>
          </Form.Item>
        )}
      </Form>
    </div>
  );
};

export default CustomerBasicInfo;
