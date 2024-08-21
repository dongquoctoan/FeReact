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
import { useEffect } from "react";
import TableFlashSale from "pages/FlashSales/subcomponents/TableFlashSale";
import { PlusOutlined } from "@ant-design/icons";
import { useHookstate } from "@hookstate/core";
import flashSaleListStore, { fetchFlashSaleList } from "pages/FlashSales/store";
import { useFormik } from "formik";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { ADD_FLASH_SALE } from "routes/route.constant";
import flashSaleApi from "apis/flashsale";

const FlashSaleList = () => {
  const flashSaleListState = useHookstate(flashSaleListStore);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFlashSaleList();
  }, []);

  const formFilter = useFormik({
    initialValues: {
      name: "",
      status: "all",
      start_time: null,
      end_time: null,
    },
    onSubmit: (data: any) => {
      fetchFlashSaleList(data);
    },
  });

  const changeFilterStatus = (status: string) => {
    const params: any = {
      ...formFilter.values,
      status,
    };

    fetchFlashSaleList(params);
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
    fetchFlashSaleList(params);
  };

  const deleteFlashSale = async (flashSaleId: string) => {
    try {
      await flashSaleApi.delete(flashSaleId);
      message.success("Xóa chương trình flash sale thành công.");
      formFilter.submitForm();
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  const finishFlashSale = async (flashSaleId: string) => {
    try {
      await flashSaleApi.finish(flashSaleId);
      message.success("Kết thúc chương trình flash sale thành công.");
      formFilter.submitForm();
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  return (
    <div>
      <Card>
        <CardTitle
          title="Danh sách flash sale"
          subtitle="Hãy bắt đầu tạo flash sale của bạn."
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
          onClick={() => navigate(ADD_FLASH_SALE)}
        >
          Tạo mới
        </Button>
        <TableFlashSale
          flashSales={flashSaleListState.flashSales.get()}
          loading={flashSaleListState.isFetchingFlashSales.get()}
          total={flashSaleListState.total.get()}
          pageSize={flashSaleListState.limit.get()}
          current={flashSaleListState.page.get()}
          onChangePage={changePage}
          onDelete={deleteFlashSale}
          onFinish={finishFlashSale}
        />
      </Card>
    </div>
  );
};

export default FlashSaleList;
