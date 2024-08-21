import { Checkbox, Form, Input, Modal, Select } from "antd";
import { useFormik } from "formik";
import { FC, useEffect } from "react";
import * as Yup from "yup";
import { isValidPhoneNumber, isValidEmail } from "utils/validate";

type Props = {
  visible?: boolean;
  onCancle?: () => void;
};

const { Option } = Select;

const schemaAddNewAddressCustomer = Yup.object().shape({
  last_name: Yup.string().required("Tên không được để trống"),
  first_name: Yup.string().required("Họ không được để trống"),
  city: Yup.string().required("Tên tỉnh/thành phố không được để trống"),
  district: Yup.string().required("Tên quận/huyện không được để trống"),
  ward: Yup.string().required("Tên xã/phường không được để trống"),
  phone: Yup.string().test(
    "validatePhoneNumber",
    "Số điện thoại không hợp lệ",
    (phone) => {
      if (phone) {
        return isValidPhoneNumber(phone);
      }
      return false;
    }
  ),
  email: Yup.string().test("validateEmail", "Email không hợp lệ", (email) => {
    if (email) {
      return isValidEmail(email);
    }
    return false;
  }),
});

const ModalEditCustomerAddress: FC<Props> = ({ visible, onCancle }) => {
  const formEditCustomerAddress = useFormik({
    initialValues: {
      id: "",
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      city: "",
      district: "",
      ward: "",
      detailAddress: "",
      isDefault: false,
    },
    validationSchema: schemaAddNewAddressCustomer,
    onSubmit: (data) => {
      console.log(data);
    },
  });

  const handleChangeCity = (value: string) => {
    formEditCustomerAddress.setValues({
      ...formEditCustomerAddress.values,
      city: value,
    });
  };

  const handleChangeDistrict = (value: string) => {
    formEditCustomerAddress.setValues({
      ...formEditCustomerAddress.values,
      district: value,
    });
  };
  const handleChangeWard = (value: string) => {
    formEditCustomerAddress.setValues({
      ...formEditCustomerAddress.values,
      ward: value,
    });
  };
  // reset form after close
  useEffect(() => {
    if (!visible) formEditCustomerAddress.resetForm();
  }, [visible]);

  return (
    <Modal
      visible={visible}
      onCancel={onCancle}
      okText="Hoàn thành"
      onOk={formEditCustomerAddress.submitForm}
    >
      <Form layout="vertical">
        <Form.Item label="Tên người dùng" style={{ marginBottom: 0 }}>
          <Form.Item
            style={{
              display: "inline-block",
              width: "calc(50% - 4px)",
              marginRight: "4px",
            }}
            validateStatus={
              formEditCustomerAddress.errors.first_name &&
              formEditCustomerAddress.touched.first_name
                ? "error"
                : ""
            }
            help={
              formEditCustomerAddress.errors.first_name &&
              formEditCustomerAddress.touched.first_name
                ? formEditCustomerAddress.errors.first_name
                : null
            }
          >
            <Input
              placeholder="Họ"
              name="first_name"
              value={formEditCustomerAddress.values.first_name}
              onChange={formEditCustomerAddress.handleChange}
              onBlur={formEditCustomerAddress.handleBlur}
            />
          </Form.Item>
          <Form.Item
            style={{
              display: "inline-block",
              width: "calc(50% - 4px)",
              marginLeft: "4px",
            }}
            validateStatus={
              formEditCustomerAddress.errors.last_name &&
              formEditCustomerAddress.touched.last_name
                ? "error"
                : ""
            }
            help={
              formEditCustomerAddress.errors.last_name &&
              formEditCustomerAddress.touched.last_name
                ? formEditCustomerAddress.errors.last_name
                : null
            }
          >
            <Input
              placeholder="Tên"
              name="last_name"
              value={formEditCustomerAddress.values.last_name}
              onChange={formEditCustomerAddress.handleChange}
              onBlur={formEditCustomerAddress.handleBlur}
            />
          </Form.Item>
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          validateStatus={
            formEditCustomerAddress.errors.phone &&
            formEditCustomerAddress.touched.phone
              ? "error"
              : ""
          }
          help={
            formEditCustomerAddress.errors.phone &&
            formEditCustomerAddress.touched.phone
              ? formEditCustomerAddress.errors.phone
              : null
          }
        >
          <Input
            placeholder="VD: 0334455667"
            name="phone"
            value={formEditCustomerAddress.values.phone}
            onBlur={formEditCustomerAddress.handleBlur}
            onChange={formEditCustomerAddress.handleChange}
          />
        </Form.Item>
        <Form.Item
          label="Email"
          validateStatus={
            formEditCustomerAddress.errors.email &&
            formEditCustomerAddress.touched.email
              ? "error"
              : ""
          }
          help={
            formEditCustomerAddress.errors.email &&
            formEditCustomerAddress.touched.email
              ? formEditCustomerAddress.errors.email
              : null
          }
        >
          <Input
            type="email"
            placeholder="VD: example@gmail.com"
            name="email"
            value={formEditCustomerAddress.values.email}
            onChange={formEditCustomerAddress.handleChange}
            onBlur={formEditCustomerAddress.handleBlur}
          />
        </Form.Item>
        <Form.Item
          label="Địa chỉ"
          validateStatus={
            formEditCustomerAddress.errors.city ||
            formEditCustomerAddress.errors.district ||
            formEditCustomerAddress.errors.ward
              ? "error"
              : ""
          }
          help={
            formEditCustomerAddress.errors.city ||
            formEditCustomerAddress.errors.district ||
            formEditCustomerAddress.errors.ward
              ? "Không được để trống mục này"
              : null
          }
        >
          <Select
            style={{ width: "calc(32%)" }}
            showSearch
            allowClear
            onChange={handleChangeCity}
            placeholder="Tỉnh/Thành phố"
          >
            <Option value="Hà Nội">Hà Nội</Option>
            <Option value="Nam Định">Nam Định</Option>
            <Option value="Hải Phòng">Hải Phòng</Option>
          </Select>
          <Select
            style={{ width: "calc(32%)", marginLeft: "7px" }}
            showSearch
            allowClear
            onChange={handleChangeDistrict}
            placeholder="Quận/Huyện"
          >
            <Option value="Đông Anh">Đông Anh</Option>
            <Option value="Đông Hưng">Đông Hưng</Option>
            <Option value="Nghĩa Hưng">Nghĩa Hưng</Option>
          </Select>
          <Select
            style={{ width: "calc(32%)", marginLeft: "7px" }}
            showSearch
            allowClear
            onChange={handleChangeWard}
            placeholder="Xã/Phường"
          >
            <Option value="Vân Hà">Vân Hà</Option>
            <Option value="Liên Hà">Liên Hà</Option>
            <Option value="Cổ Loa">Cổ Loa</Option>
          </Select>
        </Form.Item>
        <Form.Item style={{ width: "100%" }}>
          <Input
            name="detailAddress"
            value={formEditCustomerAddress.values.detailAddress}
            onChange={formEditCustomerAddress.handleChange}
            placeholder="VD: Đường, Số nhà,..."
          />
        </Form.Item>
        <Form.Item>
          <Checkbox
            name="isDefault"
            onChange={formEditCustomerAddress.handleChange}
          >
            Thiết lập địa chỉ mặc định
          </Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default ModalEditCustomerAddress;
