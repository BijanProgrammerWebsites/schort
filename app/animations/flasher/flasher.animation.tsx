"use client";

import { ReactElement, useEffect } from "react";

import { motion, Transition, useAnimation, Variants } from "framer-motion";

import styles from "./flasher.module.scss";

interface FlasherAnimationProps {
  separator?: string;
  shouldStart?: boolean;
  doneCallback?: () => void;
  baseDelay?: number;
  children: string;
}

export default function FlasherAnimation({
  separator = " ",
  shouldStart = true,
  doneCallback,
  baseDelay = 0,
  children,
}: FlasherAnimationProps): ReactElement {
  const controls = useAnimation();

  const variants: Variants = {
    hidden: { opacity: 0, scale: 1.48, transformOrigin: "center" },
    visible: { opacity: 1, scale: 1 },
  };

  const transition: Transition = {
    duration: 0.2,
    ease: [0.6, 0, 0.18, 2.4],
  };

  useEffect(() => {
    if (shouldStart) {
      controls.start("visible").then(doneCallback);
    }
  }, [controls, shouldStart]);

  return (
    <>
      {children.split(separator).map((word, index) => (
        <motion.span
          className={styles.word}
          key={index}
          variants={variants}
          initial="hidden"
          animate={controls}
          transition={{ ...transition, delay: baseDelay + index * 0.24 }}
        >
          {word}{" "}
        </motion.span>
      ))}
    </>
  );
}
