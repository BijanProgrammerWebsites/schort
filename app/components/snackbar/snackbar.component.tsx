import { ReactElement, ReactNode } from "react";

import { FaCheck, FaInfo, FaTimes } from "react-icons/fa";

import { SnackbarVariantEnum } from "@/app/enums/snackbar-variant.enum";

import styles from "./snackbar.module.scss";

export default function SnackbarComponent({
  variant = SnackbarVariantEnum.BASIC,
  children,
}: {
  variant: SnackbarVariantEnum;
  children: ReactNode;
}): ReactElement {
  return (
    <div className={`${styles["snackbar-component"]} ${styles[variant]}`}>
      <div className={styles.icon}>
        {variant === SnackbarVariantEnum.BASIC && <FaInfo />}
        {variant === SnackbarVariantEnum.SUCCESS && <FaCheck />}
        {variant === SnackbarVariantEnum.DANGER && <FaTimes />}
      </div>

      <div className={styles.message}>{children}</div>
    </div>
  );
}
