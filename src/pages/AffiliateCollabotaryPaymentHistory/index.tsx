import { Card } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import CardTitle from "components/CardTitle";
import { PaymentHistory } from "constants/types/affiliateRequest.type";
import styles from "pages/AffiliateCollabotaryPaymentHistory/AffiliateCollabotaryPaymentHistory.module.css";
import { useEffect, useMemo } from "react";
import PriceText from "components/PriceText";
import { useHookstate } from "@hookstate/core";
import store, {
  getAffiliateCollaboratorPaymentHistory,
} from "pages/AffiliateCollabotaryPaymentHistory/store";
import { useParams } from "react-router-dom";
import moment from "moment";

const AffiliateCollaboratorPaymentHistory: React.FunctionComponent = () => {
  const paymentHistoryState = useHookstate(store);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getAffiliateCollaboratorPaymentHistory(id);
    }
  }, [id]);

  const columns: ColumnsType<PaymentHistory> = useMemo(
    () => [
      {
        title: "Ngày cập nhật",
        dataIndex: "affiliate_money_update_time",
        render: (text) => moment.utc(text).format("DD/MM/yyyy"),
      },
      {
        title: "Số tiền",
        dataIndex: "affiliate_money_number",
        render: (value) => <PriceText prices={[value]} />,
      },
    ],
    []
  );

  return (
    <div className={styles.wrapper}>
      <Card bordered={false}>
        <CardTitle
          title="Quản lý lịch sử thanh toán"
          subtitle="Tổng hợp lịch sử thanh toán cho cộng tác viên"
        />
        <div>
          <Table
            size="small"
            bordered
            columns={columns}
            dataSource={paymentHistoryState.data.get()}
            loading={paymentHistoryState.isLoadingGetAllPaymentHistory.get()}
          />
        </div>
      </Card>
    </div>
  );
};

export default AffiliateCollaboratorPaymentHistory;
