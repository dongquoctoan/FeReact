import React from "react";
import StatisticGeneral from "pages/Vouchers/subcomponents/StatisticGeneral";
import ContentVoucher from "pages/Vouchers/subcomponents/ContentVoucher";
import styles from "pages/Vouchers/Vouchers.module.css";

const Voucher: React.FC = () => {
  return (
    <>
      {/*
      TODO 
      <StatisticGeneral /> 
      */}
      <div className={styles.content}>
        <ContentVoucher />
      </div>
    </>
  );
};

export default Voucher;
