import { ReactElement } from "react";
import styles from "./loading.module.scss";

export default function Loading(): ReactElement {
  return (
    <div className={styles.loading}>
      <div className={styles.dots}>
        <i className={styles.dot}></i>
        <i className={styles.dot}></i>
        <i className={styles.dot}></i>
      </div>
    </div>
  );
}
