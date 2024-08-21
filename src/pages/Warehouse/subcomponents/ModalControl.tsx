import { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import { Warehouse } from "constants/types/warehouse.type";
import { Form, Input, Modal, Select } from "antd";
import * as Yup from "yup";
import { addressApi } from "apis/address";
import { isValidPhoneNumber } from "utils/validate";

type FormControlValue = {
  name: string;
  code: string;
  description: string;
  city_id: string;
  district_id: string;
  ward_id: string;
  address_line: string;
  phone: string;
  manager_name: string;
};

type Props = {
  isOpen: boolean;
  warehouse?: Warehouse;
  onCancel: () => void;
  onSubmit: (data: any) => void;
};

const formControlWarehouseSchema = Yup.object().shape({
  name: Yup.string().required("Tên kho hàng không được để trống!"),
  code: Yup.string().required("Mã kho hàng không được để trống!"),
  address_line: Yup.string().required("Địa chỉ không được để trống!"),
  city_id: Yup.string().required("Tỉnh/TP không được để trống!"),
  district_id: Yup.string().required("Quận/Huyện không được để trống!"),
  ward_id: Yup.string().required("Xã/Phường không được để trống!"),
  manager_name: Yup.string().required("Xã/Phường không được để trống!"),
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
  description: Yup.string(),
});

const rowFormStyle = {
  width: "100%",
  display: "flex",
  gap: "1rem",
};

const ModalControlWarehouse: FC<Props> = ({
  isOpen,
  onCancel,
  onSubmit,
  warehouse,
}) => {
  const initialValues: FormControlValue = {
    name: "",
    code: "",
    description: "",
    city_id: "",
    district_id: "",
    ward_id: "",
    address_line: "",
    phone: "",
    manager_name: "",
  };

  const formControlWarehouse = useFormik({
    initialValues: initialValues,
    validationSchema: formControlWarehouseSchema,
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
    if (formControlWarehouse.values.city_id)
      fetchDistrict(formControlWarehouse.values.city_id);
  }, [formControlWarehouse.values.city_id]);

  useEffect(() => {
    if (formControlWarehouse.values.district_id)
      fetchWard(formControlWarehouse.values.district_id);
  }, [formControlWarehouse.values.district_id]);

  useEffect(() => {
    if (isOpen && warehouse) {
      const {
        name,
        code,
        description,
        address_line,
        city_id,
        district_id,
        ward_id,
        phone,
        manager_name,
      } = warehouse;
      formControlWarehouse.setValues({
        name,
        code,
        description,
        address_line,
        city_id,
        district_id,
        ward_id,
        phone,
        manager_name,
      });
    }
  }, [isOpen, warehouse]);

  useEffect(() => {
    if (!isOpen) formControlWarehouse.resetForm();
  }, [isOpen]);

  return (
    <Modal
      visible={isOpen}
      onCancel={onCancel}
      okText="Lưu"
      title={warehouse ? "Chỉnh sửa kho hàng" : "Tạo mới kho hàng"}
      onOk={formControlWarehouse.submitForm}
      style={{ top: 30 }}
    >
      <Form layout="vertical">
        <div style={rowFormStyle}>
          <Form.Item
            style={{ width: "100%" }}
            label="Tên kho hàng"
            validateStatus={
              formControlWarehouse.errors.name &&
              formControlWarehouse.touched.name
                ? "error"
                : ""
            }
            help={
              formControlWarehouse.errors.name &&
              formControlWarehouse.touched.name
                ? formControlWarehouse.errors.name
                : ""
            }
          >
            <Input
              placeholder="Tên kho hàng"
              name="name"
              value={formControlWarehouse.values.name}
              onChange={formControlWarehouse.handleChange}
            />
          </Form.Item>
          <Form.Item
            style={{ width: "100%" }}
            label="Mã kho hàng"
            validateStatus={
              formControlWarehouse.errors.code &&
              formControlWarehouse.touched.code
                ? "error"
                : ""
            }
            help={
              formControlWarehouse.errors.code &&
              formControlWarehouse.touched.code
                ? formControlWarehouse.errors.code
                : ""
            }
          >
            <Input
              placeholder="Mã kho hàng"
              name="code"
              value={formControlWarehouse.values.code}
              onChange={formControlWarehouse.handleChange}
            />
          </Form.Item>
        </div>
        <div style={rowFormStyle}>
          <Form.Item
            style={{ width: "100%" }}
            label="Người quản lý"
            validateStatus={
              formControlWarehouse.errors.manager_name &&
              formControlWarehouse.touched.manager_name
                ? "error"
                : ""
            }
            help={
              formControlWarehouse.errors.manager_name &&
              formControlWarehouse.touched.manager_name
                ? formControlWarehouse.errors.manager_name
                : ""
            }
          >
            <Input
              placeholder="Tên người quản lý"
              name="manager_name"
              value={formControlWarehouse.values.manager_name}
              onChange={formControlWarehouse.handleChange}
            />
          </Form.Item>
          <Form.Item
            style={{ width: "100%" }}
            label="Số điện thoại"
            validateStatus={
              formControlWarehouse.errors.phone &&
              formControlWarehouse.touched.phone
                ? "error"
                : ""
            }
            help={
              formControlWarehouse.errors.phone &&
              formControlWarehouse.touched.phone
                ? formControlWarehouse.errors.phone
                : ""
            }
          >
            <Input
              width="100%"
              placeholder="VD: 0334455667"
              name="phone"
              value={formControlWarehouse.values.phone}
              onChange={formControlWarehouse.handleChange}
            />
          </Form.Item>
        </div>
        <Form.Item
          label="Tỉnh/TP"
          validateStatus={
            formControlWarehouse.errors.city_id &&
            formControlWarehouse.touched.city_id
              ? "error"
              : ""
          }
          help={
            formControlWarehouse.errors.city_id &&
            formControlWarehouse.touched.city_id
              ? formControlWarehouse.errors.city_id
              : ""
          }
        >
          <Select
            placeholder="Lựa chọn Tỉnh/TP"
            value={formControlWarehouse.values.city_id || null}
            onChange={(value: string) => {
              formControlWarehouse.setFieldValue("city_id", value);
              formControlWarehouse.setFieldValue("district_id", "");
              formControlWarehouse.setFieldValue("ward_id", "");
            }}
          >
            {cities.map((item: any, index: number) => (
              <Select.Option key={index} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Quận/Huyện"
          validateStatus={
            formControlWarehouse.errors.district_id &&
            formControlWarehouse.touched.district_id
              ? "error"
              : ""
          }
          help={
            formControlWarehouse.errors.district_id &&
            formControlWarehouse.touched.district_id
              ? formControlWarehouse.errors.district_id
              : ""
          }
        >
          <Select
            placeholder="Lựa chọn Quận/Huyện"
            value={formControlWarehouse.values.district_id || null}
            onChange={(value: string) => {
              formControlWarehouse.setFieldValue("district_id", value);
              formControlWarehouse.setFieldValue("ward_id", "");
            }}
          >
            {districts.map((item: any, index: number) => (
              <Select.Option key={index} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Phường/Xã"
          validateStatus={
            formControlWarehouse.errors.ward_id &&
            formControlWarehouse.touched.ward_id
              ? "error"
              : ""
          }
          help={
            formControlWarehouse.errors.ward_id &&
            formControlWarehouse.touched.ward_id
              ? formControlWarehouse.errors.ward_id
              : ""
          }
        >
          <Select
            placeholder="Lựa chọn Phường/Xã"
            value={formControlWarehouse.values.ward_id || null}
            onChange={(value) =>
              formControlWarehouse.setFieldValue("ward_id", value)
            }
          >
            {wards.map((item: any, index: number) => (
              <Select.Option key={index} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Địa chỉ cụ thể"
          validateStatus={
            formControlWarehouse.errors.address_line &&
            formControlWarehouse.touched.address_line
              ? "error"
              : ""
          }
          help={
            formControlWarehouse.errors.address_line &&
            formControlWarehouse.touched.address_line
              ? formControlWarehouse.errors.address_line
              : ""
          }
        >
          <Input
            placeholder="ví dụ: 24 ngõ 32 ...."
            name="address_line"
            value={formControlWarehouse.values.address_line}
            onChange={formControlWarehouse.handleChange}
          />
        </Form.Item>
        <Form.Item
          label="Ghi chú"
          validateStatus={
            formControlWarehouse.errors.description &&
            formControlWarehouse.touched.description
              ? "error"
              : ""
          }
          help={
            formControlWarehouse.errors.description &&
            formControlWarehouse.touched.description
              ? formControlWarehouse.errors.description
              : ""
          }
        >
          <Input.TextArea
            placeholder="Ví dụ: đối diện siêu thị"
            name="description"
            value={formControlWarehouse.values.description}
            onChange={formControlWarehouse.handleChange}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalControlWarehouse;
