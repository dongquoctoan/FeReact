import React, { FC, ReactNode } from "react";
import styles from "components/VoucherControl/subcomponents/RadioGroupVoucherType/subcomponents/RadioVoucherType/RadioVoucherType.module.css";
import { CheckOutlined } from "@ant-design/icons";
import cx from "classnames";
import { Space } from "antd";

type Props = {
  icon?: ReactNode;
  children: ReactNode;
  onClick: () => void;
  actived?: boolean;
};

const RadioVoucherType: FC<Props> = ({ icon, children, onClick, actived }) => {
  return (
    <div
      className={cx(styles.wrapper, { [styles.actived]: actived })}
      onClick={onClick}
    >
      <Space>
        <div className={styles.icon}>{icon}</div>
        {children}
      </Space>

      <div className={cx(styles.triangle, {})}>
        <CheckOutlined style={{ fontSize: 12, color: "#fff" }} />
      </div>
    </div>
  );
};

export default RadioVoucherType;
