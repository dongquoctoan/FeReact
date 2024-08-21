import React, { useEffect, useMemo } from "react";
import { Button, Card, DatePicker, Divider, Row, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FileOutlined } from "@ant-design/icons";
import CardTitle from "components/CardTitle";
import store, {
  getAffiliateCollaboratorDetail,
} from "pages/AffiliateCollaboratorDetail/store";
import { useParams } from "react-router-dom";
import { useHookstate } from "@hookstate/core";
import styles from "pages/AffiliateCollaboratorDetail/AffiliateCollaboratorDetail.module.css";
import PriceText from "components/PriceText";
import { RevenuePerMonth } from "constants/types/affiliateRequest.type";

const AffiliateCollaboratorDetail: React.FunctionComponent = () => {
  const collaboratorState = useHookstate(store);
  const { id } = useParams();
  const monthYear = (month_year: string) => {
    const dateObj = new Date(month_year);
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    const outputString = ("0" + month).slice(-2) + "/" + year;
    return outputString;
  };

  useEffect(() => {
    if (id) {
      getAffiliateCollaboratorDetail(id);
    }
  }, [id]);

  const totalRevenue = collaboratorState.data
    .get()
    .reduce((accumulator, record) => {
      return accumulator + record.money;
    }, 0);

  const columns: ColumnsType<RevenuePerMonth> = useMemo(
    () => [
      {
        title: "Thời gian",
        dataIndex: "month_year",
        render: (month_year) => monthYear(month_year),
      },
      {
        title: "Doanh thu",
        dataIndex: "money",
        render: (value) => <PriceText prices={[value]} />,
      },
    ],
    []
  );

  return (
    <Card bordered={false}>
      <CardTitle
        title="Quản lý doanh thu"
        subtitle="Tổng hợp doanh thu của cộng tác viên theo tháng"
      />
      {collaboratorState.haveRevenue.get() ? (
        <>
          <Card size="small">
            <div className={styles.totalPayment}>
              <div className={styles.totalPaymentText}>
                Tổng thu nhập của cộng tác viên
              </div>
              <div>
                <PriceText prices={[totalRevenue]} />
              </div>
            </div>
          </Card>
          <Divider />
          <Table
            columns={columns}
            dataSource={collaboratorState.data.get()}
            loading={collaboratorState.isLoadingGetAllDetail.get()}
          />
        </>
      ) : (
        <>
          <Card size="small">
            <div className={styles.totalPayment}>
              <div className={styles.totalPaymentText}>
                Tổng thu nhập của cộng tác viên
              </div>
              <div>
                <PriceText prices={[0]} />
              </div>
            </div>
          </Card>
        </>
      )}
    </Card>
  );
};

export default AffiliateCollaboratorDetail;
