import { ShopFilled, ShoppingFilled } from "@ant-design/icons";
import styles from "components/VoucherControl/subcomponents/RadioGroupVoucherType/RadioGroupVoucherType.module.css";
import RadioVoucherType from "components/VoucherControl/subcomponents/RadioGroupVoucherType/subcomponents/RadioVoucherType";
import {
  VOUCHER_ALL_PRODUCT_TYPE,
  VOUCHER_PRODUCT_TYPE,
} from "constants/Voucher/voucherType";
import React from "react";

type Props = {
  disable?: boolean;
  value: string;
  onChange: (value: string) => void;
};

const RadioGroupVoucherType: React.FC<Props> = ({
  disable,
  value,
  onChange,
}) => {
  const changeVoucherType = (type: string) => {
    !disable && onChange(type);
  };

  return (
    <div className={styles.wrapper}>
      <RadioVoucherType
        icon={<ShopFilled />}
        onClick={() => changeVoucherType(VOUCHER_ALL_PRODUCT_TYPE)}
        actived={value == VOUCHER_ALL_PRODUCT_TYPE}
      >
        Voucher toàn Shop
      </RadioVoucherType>
      <RadioVoucherType
        icon={<ShoppingFilled />}
        onClick={() => changeVoucherType(VOUCHER_PRODUCT_TYPE)}
        actived={value == VOUCHER_PRODUCT_TYPE}
      >
        Voucher sản phẩm
      </RadioVoucherType>
    </div>
  );
};

export default RadioGroupVoucherType;
