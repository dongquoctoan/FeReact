import React from "react";
import { Card } from "antd";
import styles from "pages/Vouchers/subcomponents/StatisticGeneral/StatisticGeneral.module.css";
import StatisticCard from "pages/Vouchers/subcomponents/StatisticGeneral/StatisticCard";

const StatisticGeneral: React.FC = () => {
  return (
    <Card>
      <div className={styles.header}>
        <div className={styles.headerTitle}>Thông số phân tích</div>
        <div className={styles.headerTime}>
          (Từ 05-07-2022 đến 12-07-2022GMT+7)
        </div>
      </div>

      <div className={styles.statisticContent}>
        <StatisticCard title="Doanh số" data={0} />
        <StatisticCard title="Đơn hàng" data={0} />
        <StatisticCard title="Tỷ lệ sử dụng" data={0} />
        <StatisticCard title="Người mua" data={0} />
      </div>
    </Card>
  );
};

export default StatisticGeneral;
