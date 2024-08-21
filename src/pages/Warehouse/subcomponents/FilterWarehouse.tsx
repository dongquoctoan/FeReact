import { Button, Input, Select, Space, Tabs } from "antd";
import { addressApi } from "apis/address";
import { FC, useState, useEffect } from "react";
import { useFormik } from "formik";

type Props = {
  onFilter: (data: FormFilterValue | any) => void;
  setActiveTabKey: (value: string) => void;
};
type FormFilterValue = {
  keyword: string;
  city_id: string;
  district_id: string;
  ward_id: string;
  status: string;
};

export const FilterWarehouse: FC<Props> = ({ onFilter, setActiveTabKey }) => {
  const initialValues: FormFilterValue = {
    keyword: "",
    city_id: "",
    district_id: "",
    ward_id: "",
    status: "",
  };

  const formFilterWarehouse = useFormik({
    initialValues: initialValues,
    onSubmit: (data) => {
      onFilter(data);
    },
  });

  const changeFilterStatus = (status: string) => {
    const params: any = {
      ...formFilterWarehouse.values,
      status,
    };
    onFilter(params);
    formFilterWarehouse.setFieldValue("status", status);
    setActiveTabKey(status);
  };

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
    if (formFilterWarehouse.values.city_id)
      fetchDistrict(formFilterWarehouse.values.city_id);
  }, [formFilterWarehouse.values.city_id]);

  useEffect(() => {
    if (formFilterWarehouse.values.district_id)
      fetchWard(formFilterWarehouse.values.district_id);
  }, [formFilterWarehouse.values.district_id]);

  return (
    <>
      <Tabs
        activeKey={formFilterWarehouse.values.status}
        onChange={changeFilterStatus}
      >
        <Tabs.TabPane tab="Tất cả" key="" />
        <Tabs.TabPane tab="Đã kích hoạt" key="actived" />
        {/* <Tabs.TabPane tab="Chưa kích hoạt" key="unactived" /> */}
        <Tabs.TabPane tab="Đã khóa" key="locked" />
        <Tabs.TabPane tab="Đã xóa" key="deleted" />
      </Tabs>
      <div style={{ marginBottom: "16px" }}>
        <Space>
          <Input
            name="keyword"
            placeholder="Nhập tên kho hàng"
            value={formFilterWarehouse.values.keyword}
            onChange={formFilterWarehouse.handleChange}
          />
          <Select
            allowClear
            placeholder="Lựa chọn Tỉnh/TP"
            value={formFilterWarehouse.values.city_id || null}
            onChange={(value: string) => {
              formFilterWarehouse.setFieldValue("city_id", value);
              formFilterWarehouse.setFieldValue("district_id", "");
              formFilterWarehouse.setFieldValue("ward_id", "");
            }}
          >
            {cities.map((item: any, index: number) => (
              <Select.Option key={index} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
          <Select
            allowClear
            placeholder="Lựa chọn Quận/Huyện"
            value={formFilterWarehouse.values.district_id || null}
            onChange={(value: string) => {
              formFilterWarehouse.setFieldValue("district_id", value);
              formFilterWarehouse.setFieldValue("ward_id", "");
            }}
          >
            {districts.map((item: any, index: number) => (
              <Select.Option key={index} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
          <Select
            allowClear
            placeholder="Lựa chọn Phường/Xã"
            value={formFilterWarehouse.values.ward_id || null}
            onChange={(value) =>
              formFilterWarehouse.setFieldValue("ward_id", value)
            }
          >
            {wards.map((item: any, index: number) => (
              <Select.Option key={index} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
          <Button
            htmlType="submit"
            type="primary"
            onClick={formFilterWarehouse.submitForm}
          >
            Tìm kiếm
          </Button>
        </Space>
      </div>
    </>
  );
};
