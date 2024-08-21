import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, message, Tabs } from "antd";
import { voucherApi } from "apis/voucher";
import CardTitle from "components/CardTitle";
import { useFormik } from "formik";
import useQueryVouchers from "pages/Vouchers/hooks/useQueryVouchers";
import styles from "pages/Vouchers/subcomponents/ContentVoucher/ContentVoucher.module.css";
import VoucherTable from "pages/Vouchers/subcomponents/ContentVoucher/subcomponents/VoucherTable";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ADD_NEW_VOUCHER } from "routes/route.constant";

const ContentVoucher: React.FC = () => {
  const navigate = useNavigate();

  const { vouchersState, handleGetVouchers } = useQueryVouchers();

  const handleOnPageChange = (page: number, pageSize: number) => {
    const params = {
      page,
      limit: pageSize,
    };
    handleGetVouchers(params);
  };

  const formFilter = useFormik({
    initialValues: {
      status: "",
    },
    onSubmit: (data: any) => {
      handleGetVouchers(data);
    },
  });

  const changeFilterStatus = (status: string) => {
    const params: any = {
      ...formFilter.values,
      status,
    };
    handleGetVouchers(params);
    formFilter.setFieldValue("status", status);
  };

  const handleConfirmDeleteVoucher = async (idVoucher: string) => {
    try {
      await voucherApi.delete(idVoucher);
      message.success("Xóa mã giảm giá thành công!");
      handleGetVouchers();
    } catch (error) {
      message.error("Xóa mã giảm giá không thành công!");
    }
  };
  const handleConfirmFinishVoucher = async (idVoucher: string) => {
    try {
      await voucherApi.finish(idVoucher);
      message.success("Kết thúc mẫ giảm giá thành công!");
      handleGetVouchers();
    } catch (error) {
      message.error("Kết thúc mã giảm giá không thành công!");
    }
  };

  return (
    <Card>
      <div className={styles.header}>
        <CardTitle
          title="Danh sách mã giảm giá"
          subtitle="Tạo Mã giảm giá toàn shop hoặc Mã giảm giá sản phẩm ngay bây giờ để thu hút người mua"
        />
        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => navigate(ADD_NEW_VOUCHER)}
        >
          Tạo
        </Button>
      </div>
      <div>
        <Tabs
          activeKey={formFilter.values.status}
          onChange={changeFilterStatus}
        >
          <Tabs.TabPane tab="Tất cả" key="" />
          <Tabs.TabPane tab="Đang diễn ra" key="happening" />
          <Tabs.TabPane tab="Sắp diễn ra" key="upcoming" />
          <Tabs.TabPane tab="Đã kết thúc" key="finished" />
        </Tabs>
        <VoucherTable
          data={vouchersState.vouchers}
          limit={vouchersState.limit}
          page={vouchersState.page}
          total={vouchersState.total}
          loading={vouchersState.isLoadingGetAllVoucher}
          handleChangePage={handleOnPageChange}
          handleDeleteVoucher={handleConfirmDeleteVoucher}
          handleFinishVoucher={handleConfirmFinishVoucher}
        />
      </div>
    </Card>
  );
};

export default ContentVoucher;
