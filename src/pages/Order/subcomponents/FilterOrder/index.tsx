import { Button, Form, Input, Tabs } from "antd";
import { FC } from "react";
import { useFormik } from "formik";

type Props = {
  onFilter: (data: FormFilterValue | any) => void;
};
type FormFilterValue = {
  min_paymnet: string;
  max_paymnet: string;
  status: string;
};

export const FilterOrder: FC<Props> = ({ onFilter }) => {
  const initialValues: FormFilterValue = {
    min_paymnet: "",
    max_paymnet: "",
    status: "",
  };

  const formFilterOrder = useFormik({
    initialValues: initialValues,
    onSubmit: (data) => {
      onFilter(data);
    },
  });

  const changeFilterStatus = (status: string) => {
    const params: any = {
      ...formFilterOrder.values,
      status,
    };
    onFilter(params);
    formFilterOrder.setFieldValue("status", status);
  };

  return (
    <>
      <Tabs
        activeKey={formFilterOrder.values.status}
        onChange={changeFilterStatus}
      >
        <Tabs.TabPane tab="Tất cả" key="" />
        <Tabs.TabPane tab="Chờ xác nhận" key="WAITING_CONFIRM" />
        <Tabs.TabPane tab="Chuẩn bị giao hàng" key="WAITING_SHIPPING" />
        <Tabs.TabPane tab="Đang giao" key="SHIPPING_" />
        <Tabs.TabPane tab="Hoàn thành" key="COMPLETED" />
        <Tabs.TabPane tab="Đã hủy" key="CANCELED" />
      </Tabs>
      <Form layout="inline" onFinish={formFilterOrder.submitForm}>
        <Form.Item>
          <Input
            name="min_paymnet"
            placeholder="Tổng tiền thấp nhất"
            value={formFilterOrder.values.min_paymnet}
            onChange={formFilterOrder.handleChange}
          />
        </Form.Item>
        <Form.Item>
          <Input
            name="max_paymnet"
            placeholder="Tổng tiền cao nhất"
            value={formFilterOrder.values.max_paymnet}
            onChange={formFilterOrder.handleChange}
          />
        </Form.Item>
        <Button htmlType="submit" type="primary">
          Tìm kiếm
        </Button>
      </Form>
    </>
  );
};

export default FilterOrder;
