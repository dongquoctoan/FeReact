import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Tabs,
} from "antd";
import CardTitle from "components/CardTitle";
import React, { useEffect } from "react";
import TableDiscount from "pages/DiscountList/subcomponents/TableDiscount";
import { PlusOutlined } from "@ant-design/icons";
import { useHookstate } from "@hookstate/core";
import discountListStore, { fetchDiscountList } from "pages/DiscountList/store";
import { useFormik } from "formik";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { ADD_DISCOUNT } from "routes/route.constant";
import discountApi from "apis/discount";

const DiscountList = () => {
  const discountListState = useHookstate(discountListStore);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDiscountList();
  }, []);

  //   filter discount list
  const formFilter = useFormik({
    initialValues: {
      name: "",
      status: "all",
      start_time: null,
      end_time: null,
    },
    onSubmit: (data: any) => {
      fetchDiscountList(data);
    },
  });

  const changeFilterStatus = (status: string) => {
    const params: any = {
      ...formFilter.values,
      status,
    };
    fetchDiscountList(params);
    formFilter.setFieldValue("status", status);
  };

  const changeFilterTime = (dates: any, dateStrings: [string, string]) => {
    formFilter.setFieldValue("start_time", dateStrings[0]);
    formFilter.setFieldValue("end_time", dateStrings[1]);
  };

  const changePage = (page: number, pageSize: number) => {
    const params = {
      ...(formFilter.values as any),
      page,
      limit: pageSize,
    };
    fetchDiscountList(params);
  };

  const deleteDiscount = async (discountId: string) => {
    try {
      await discountApi.delete(discountId);
      message.success("Xóa chương trình khuyến mãi thành công.");
      formFilter.submitForm();
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  const finishDiscount = async (discountId: string) => {
    try {
      await discountApi.finish(discountId);
      message.success("Kết thúc chương trình khuyến mãi thành công.");
      formFilter.submitForm();
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  return (
    <div>
      <Card>
        <CardTitle
          title="Danh sách chương trình"
          subtitle="Hãy bắt đầu tạo Chương Trình Khuyến Mãi của bạn."
        />
        <Tabs
          activeKey={formFilter.values.status}
          onChange={changeFilterStatus}
        >
          <Tabs.TabPane tab="Tất cả" key="all" />
          <Tabs.TabPane tab="Đang diễn ra" key="happening" />
          <Tabs.TabPane tab="Sắp diễn ra" key="upcoming" />
          <Tabs.TabPane tab="Đã kết thúc" key="finished" />
        </Tabs>

        <Form colon={false} onFinish={formFilter.submitForm}>
          <Row gutter={16}>
            <Col span={7}>
              <Form.Item label="Tìm kiếm">
                <Input
                  name="name"
                  value={formFilter.values.name}
                  onChange={formFilter.handleChange}
                  placeholder="Tên chương trình"
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="Thời gian khuyến mãi">
                <DatePicker.RangePicker
                  value={[
                    formFilter.values.start_time &&
                      moment(formFilter.values.start_time, "DD-MM-YYYY"),
                    formFilter.values.end_time &&
                      moment(formFilter.values.end_time, "DD-MM-YYYY"),
                  ]}
                  onChange={changeFilterTime}
                  format="DD-MM-YYYY"
                />
              </Form.Item>
            </Col>
            <Col>
              <Button type="primary" htmlType="submit">
                Tìm
              </Button>
            </Col>
          </Row>
        </Form>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          style={{ marginBottom: 16, float: "right" }}
          onClick={() => navigate(ADD_DISCOUNT)}
        >
          Tạo mới
        </Button>
        <TableDiscount
          discounts={discountListState.discounts.get()}
          loading={discountListState.isFetchingDiscounts.get()}
          total={discountListState.total.get()}
          pageSize={discountListState.limit.get()}
          current={discountListState.page.get()}
          onChangePage={changePage}
          onDelete={deleteDiscount}
          onFinish={finishDiscount}
        />
      </Card>
    </div>
  );
};

export default DiscountList;
