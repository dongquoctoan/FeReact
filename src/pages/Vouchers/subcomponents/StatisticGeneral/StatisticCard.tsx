import React from "react";
import styles from "pages/Vouchers/subcomponents/StatisticGeneral/StatisticGeneral.module.css";
import { Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

type Props = {
  title: string;
  data: string | number;
  ratio?: string;
  note?: string;
};

const StatisticCard: React.FC<Props> = (props) => {
  return (
    <div className={styles.metric}>
      <div className={styles.metricTitle}>
        {props.title}
        <span>
          <Tooltip title={props.note || "chú thích"}>
            <QuestionCircleOutlined />
          </Tooltip>
        </span>
      </div>
      <div className={styles.metricData}>{props.data}</div>
      <div className={styles.metricRatio}>
        {props.ratio || "so với 7 ngày trước 0.00%"}
      </div>
    </div>
  );
};

export default StatisticCard;
