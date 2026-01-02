import { ReactElement, ReactNode } from "react";

import Link, { LinkProps } from "next/link";

import { FaArrowUpRightFromSquare } from "react-icons/fa6";

import styles from "./link.module.scss";

export enum LinkComponentVariant {
  BASIC = "basic",
  BUTTON = "button",
  GHOST = "ghost",
}

export enum LinkComponentSize {
  UNSET = "",
  LARGE = "size--large",
}

interface LinkComponentProps extends LinkProps {
  isExternal?: boolean;
  variant?: LinkComponentVariant;
  size?: LinkComponentSize;
  fontClassName?: string;
  children?: ReactNode;
}

export default function LinkComponent({
  isExternal = false,
  variant = LinkComponentVariant.BASIC,
  size = LinkComponentSize.UNSET,
  fontClassName,
  children,
  ...linkProps
}: LinkComponentProps): ReactElement {
  return (
    <Link
      className={`${styles.link} ${styles[variant]} ${styles[size]} ${fontClassName}`}
      target={isExternal ? "_blank" : "_self"}
      {...linkProps}
    >
      <span className={styles.children}>{children}</span>
      {isExternal && <FaArrowUpRightFromSquare />}
    </Link>
  );
}
