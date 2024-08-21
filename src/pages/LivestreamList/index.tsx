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
import TableLivestream from "pages/LivestreamList/subcomponents/TableLivestream";
import { PlusOutlined } from "@ant-design/icons";
import { useHookstate } from "@hookstate/core";
import { useFormik } from "formik";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import livestreamApi from "apis/livestream";
import store, { getLivestreamList } from "pages/LivestreamList/store";
import { ADD_LIVESTREAM } from "routes/route.constant";

const LivestreamList = () => {
  const livestreamListState = useHookstate(store);
  const navigate = useNavigate();

  useEffect(() => {
    getLivestreamList();
  }, []);

  const formFilter = useFormik({
    initialValues: {
      title: "",
      status: "all",
      start_time: null,
      end_time: null,
    },
    onSubmit: (data: any) => {
      getLivestreamList(data);
    },
  });

  //   const changeFilterStatus = (status: string) => {
  //     const params: any = {
  //       ...formFilter.values,
  //       status,
  //     };

  //     fetchFlashSaleList(params);
  //     formFilter.setFieldValue("status", status);
  //   };

  //   const changeFilterTime = (dates: any, dateStrings: [string, string]) => {
  //     formFilter.setFieldValue("start_time", dateStrings[0]);
  //     formFilter.setFieldValue("end_time", dateStrings[1]);
  //   };

  const changePage = (page: number, pageSize: number) => {
    const params = {
      ...(formFilter.values as any),
      page,
      limit: pageSize,
    };
    getLivestreamList(params);
  };

  const deleteLivestream = async (livestreamId: string) => {
    try {
      await livestreamApi.delete(livestreamId);
      message.success("Xóa phiên livestream thành công.");
      formFilter.submitForm();
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  return (
    <div>
      <Card>
        <CardTitle
          title="Danh sách phiên livestream"
          subtitle="Hãy bắt đầu tạo phiên livestream của bạn."
        />
        <Button
          icon={<PlusOutlined />}
          type="primary"
          style={{ marginBottom: 16, float: "right" }}
          onClick={() => navigate(ADD_LIVESTREAM)}
        >
          Tạo mới
        </Button>
        <TableLivestream
          livestreamList={livestreamListState.livestreamList.get()}
          loading={livestreamListState.isFetchingLivestream.get()}
          total={livestreamListState.total.get()}
          pageSize={livestreamListState.limit.get()}
          current={livestreamListState.page.get()}
          onChangePage={changePage}
          onDelete={deleteLivestream}
        />
      </Card>
    </div>
  );
};

export default LivestreamList;
