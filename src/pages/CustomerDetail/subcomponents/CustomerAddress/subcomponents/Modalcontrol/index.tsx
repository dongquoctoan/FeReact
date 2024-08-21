import { Checkbox, Form, Input, Modal, Select } from "antd";
import { useFormik } from "formik";
import { FC, useEffect, useState } from "react";
import * as Yup from "yup";
import { isValidPhoneNumber, isValidEmail } from "utils/validate";
import { addressApi } from "apis/address";
import { CustomerAddress } from "constants/types/customerAddress.type";

type Props = {
  visible: boolean;
  addressObj?: CustomerAddress;
  onCancel?: () => void;
  onSubmit: (data: any) => void;
};

const schemaAddNewAddressCustomer = Yup.object().shape({
  name: Yup.string().required("Tên không được để trống"),
  address_line: Yup.string().required("Địa chỉ không được để trống!"),
  city_id: Yup.string().required("Tỉnh/TP không được để trống!"),
  district_id: Yup.string().required("Quận/Huyện không được để trống!"),
  ward_id: Yup.string().required("Xã/Phường không được để trống!"),
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
  is_default: Yup.bool(),
});

const ModalControlCustomerAddress: FC<Props> = ({
  visible,
  addressObj,
  onCancel,
  onSubmit,
}) => {
  const formControlCustomerAddress = useFormik({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      city_id: "",
      district_id: "",
      ward_id: "",
      address_line: "",
      is_default: false,
    },
    validationSchema: schemaAddNewAddressCustomer,
    onSubmit: (data) => {
      onSubmit(data);
    },
  });

  const [cities, setCities] = useState<Array<any>>([]);
  const [districts, setDistricts] = useState<Array<any>>([]);
  const [wards, setWards] = useState<Array<any>>([]);

  const fetchCity = async () => {
    const res = await addressApi.getCitySelection();
    setCities(res.data.result);
  };

  const fetchDistrict = async (city_id: string) => {
    const res = await addressApi.getDistrictSelection(city_id);
    setDistricts(res.data.result);
  };

  const fetchWard = async (district_id: string) => {
    const res = await addressApi.getWardSelection(district_id);
    setWards(res.data.result);
  };

  useEffect(() => {
    fetchCity();
  }, []);

  useEffect(() => {
    if (formControlCustomerAddress.values.city_id)
      fetchDistrict(formControlCustomerAddress.values.city_id);
  }, [formControlCustomerAddress.values.city_id]);

  useEffect(() => {
    if (formControlCustomerAddress.values.district_id)
      fetchWard(formControlCustomerAddress.values.district_id);
  }, [formControlCustomerAddress.values.district_id]);

  useEffect(() => {
    if (visible && addressObj) {
      const {
        name,
        address_line,
        city_id,
        district_id,
        ward_id,
        phone,
        email,
        is_default,
      } = addressObj;
      formControlCustomerAddress.setValues({
        name,
        address_line,
        city_id,
        district_id,
        ward_id,
        phone,
        email,
        is_default,
      });
    }
  }, [visible, addressObj]);

  useEffect(() => {
    if (!visible) formControlCustomerAddress.resetForm();
  }, [visible]);

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      okText="Lưu"
      onOk={formControlCustomerAddress.submitForm}
    >
      <Form layout="vertical">
        <Form.Item label="Tên người dùng" style={{ marginBottom: 0 }}>
          <Form.Item
            validateStatus={
              formControlCustomerAddress.errors.name &&
              formControlCustomerAddress.touched.name
                ? "error"
                : ""
            }
            help={
              formControlCustomerAddress.errors.name &&
              formControlCustomerAddress.touched.name
                ? formControlCustomerAddress.errors.name
                : null
            }
          >
            <Input
              placeholder="Tên người dùng"
              name="name"
              value={formControlCustomerAddress.values.name}
              onChange={formControlCustomerAddress.handleChange}
              onBlur={formControlCustomerAddress.handleBlur}
            />
          </Form.Item>
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          validateStatus={
            formControlCustomerAddress.errors.phone &&
            formControlCustomerAddress.touched.phone
              ? "error"
              : ""
          }
          help={
            formControlCustomerAddress.errors.phone &&
            formControlCustomerAddress.touched.phone
              ? formControlCustomerAddress.errors.phone
              : null
          }
        >
          <Input
            placeholder="VD: 0334455667"
            name="phone"
            value={formControlCustomerAddress.values.phone}
            onBlur={formControlCustomerAddress.handleBlur}
            onChange={formControlCustomerAddress.handleChange}
          />
        </Form.Item>
        <Form.Item
          label="Email"
          validateStatus={
            formControlCustomerAddress.errors.email &&
            formControlCustomerAddress.touched.email
              ? "error"
              : ""
          }
          help={
            formControlCustomerAddress.errors.email &&
            formControlCustomerAddress.touched.email
              ? formControlCustomerAddress.errors.email
              : null
          }
        >
          <Input
            type="email"
            placeholder="VD: example@gmail.com"
            name="email"
            value={formControlCustomerAddress.values.email}
            onChange={formControlCustomerAddress.handleChange}
            onBlur={formControlCustomerAddress.handleBlur}
          />
        </Form.Item>
        <Form.Item
          label="Địa chỉ"
          validateStatus={
            formControlCustomerAddress.errors.city_id ||
            formControlCustomerAddress.errors.district_id ||
            formControlCustomerAddress.errors.ward_id
              ? "error"
              : ""
          }
          help={
            formControlCustomerAddress.errors.city_id ||
            formControlCustomerAddress.errors.district_id ||
            formControlCustomerAddress.errors.ward_id
              ? "Không được để trống mục này"
              : null
          }
        >
          <Select
            style={{ width: "calc(32%)" }}
            showSearch
            allowClear
            value={formControlCustomerAddress.values.city_id || null}
            onChange={(value: string) => {
              formControlCustomerAddress.setFieldValue("city_id", value);
              formControlCustomerAddress.setFieldValue("district_id", "");
              formControlCustomerAddress.setFieldValue("ward_id", "");
            }}
            placeholder="Tỉnh/Thành phố"
          >
            {cities.map((item: any, index: number) => (
              <Select.Option key={index} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
          <Select
            style={{ width: "calc(32%)", marginLeft: "7px" }}
            showSearch
            allowClear
            value={formControlCustomerAddress.values.district_id || null}
            onChange={(value: string) => {
              formControlCustomerAddress.setFieldValue("district_id", value);
              formControlCustomerAddress.setFieldValue("ward_id", "");
            }}
            placeholder="Quận/Huyện"
          >
            {districts.map((item: any, index: number) => (
              <Select.Option key={index} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
          <Select
            style={{ width: "calc(32%)", marginLeft: "7px" }}
            showSearch
            allowClear
            value={formControlCustomerAddress.values.ward_id || null}
            onChange={(value) =>
              formControlCustomerAddress.setFieldValue("ward_id", value)
            }
            placeholder="Xã/Phường"
          >
            {wards.map((item: any, index: number) => (
              <Select.Option key={index} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item style={{ width: "100%" }}>
          <Input
            name="address_line"
            value={formControlCustomerAddress.values.address_line}
            onChange={formControlCustomerAddress.handleChange}
            placeholder="VD: Đường, Số nhà,..."
          />
        </Form.Item>
        <Form.Item>
          <Checkbox
            name="is_default"
            checked={formControlCustomerAddress.values.is_default}
            onChange={formControlCustomerAddress.handleChange}
          >
            Thiết lập địa chỉ mặc định
          </Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalControlCustomerAddress;
