import React, { useCallback, useEffect } from "react";
import { useHookstate } from "@hookstate/core";
import { orderApi } from "apis/order";
import store, { getAllOrder } from "pages/Order/store";
import { Card, message } from "antd";
import CardTitle from "components/CardTitle";
import FilterOrder from "pages/Order/subcomponents/FilterOrder";
import OrderTable from "pages/Order/subcomponents/OrderTable";
import styles from "pages/Order/Order.module.css";

const Order: React.FunctionComponent = () => {
  const orderState = useHookstate(store);

  const handleOnPageChange = (page: number, pageSize: number) => {
    const params = {
      page,
      limit: pageSize,
    };
    getAllOrder(params);
  };

  const handleConfirmCancelOrder = async (orderId: string) => {
    try {
      await orderApi.cancelOrder(orderId);
      message.success("Hủy đơn hàng thành công!");
      getAllOrder();
    } catch (error) {
      message.error("Hủy đơn hàng không thành công!");
    }
  };

  const onFilter = useCallback((data: any) => {
    getAllOrder(data);
  }, []);

  useEffect(() => {
    getAllOrder();
  }, []);

  return (
    <>
      <Card bordered={false}>
        <CardTitle
          title="Quản lý đơn hàng"
          subtitle="Tổng hợp đơn hàng của hệ thống"
        />
        <div className={styles.action}>
          <FilterOrder onFilter={onFilter} />
        </div>
        <OrderTable
          data={orderState.orders.get()}
          limit={orderState.limit.get()}
          page={orderState.page.get()}
          total={orderState.total.get()}
          loading={orderState.isLoadingGetAllOrder.get()}
          handleChangePage={handleOnPageChange}
          handleCancelOrder={handleConfirmCancelOrder}
        />
      </Card>
    </>
  );
};

export default Order;
