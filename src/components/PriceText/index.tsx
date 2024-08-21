import cx from "classnames";
import styles from "components/PriceText/PriceText.module.css";
import { FC, ReactNode } from "react";
import { formatNumber } from "utils/number";

type Type = "primary" | "lineThrough" | "basic";

type Props = {
  className?: string;
  children?: ReactNode;
  currencyClassName?: string;
  type?: Type;
  prices: Array<number> | Array<string>;
};

const PriceText: FC<Props> = ({
  className,
  currencyClassName,
  prices = [],
  type = "primary",
}) => {
  return (
    <div
      className={cx(
        styles.wrapper,
        { [styles.pricePrimary]: type == "primary" },
        { [styles.priceLineThrough]: type == "lineThrough" },
        className
      )}
    >
      {prices.map((price, index) => (
        <span key={index}>
          <span className={cx(styles.currency, currencyClassName)}>
            {price < 0 && "-"}₫
          </span>
          {isNaN(Number(prices))
            ? formatNumber(price)
            : formatNumber(Math.abs(Number(price)))}
          {index < prices.length - 1 && <span>&nbsp;-&nbsp;</span>}
        </span>
      ))}
    </div>
  );
};

export default PriceText;
