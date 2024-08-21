import React, { FC } from "react";
import styles from "components/CardTitle/CardTitle.module.css";

type Props = {
  title: string;
  subtitle?: string;
};

const CardTitle: FC<Props> = ({ title, subtitle }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>{title}</div>
      <span className={styles.subtitle}>{subtitle}</span>
    </div>
  );
};

export default CardTitle;
