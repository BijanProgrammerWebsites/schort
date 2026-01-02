"use client";

import { ReactElement, useEffect } from "react";

import { motion, Transition, useAnimation, Variants } from "framer-motion";

import styles from "./typewriter.module.scss";

interface TypewriterAnimationProps {
  shouldStart?: boolean;
  doneCallback?: () => void;
  baseDelay?: number;
  children: string;
}

export default function TypewriterAnimation({
  shouldStart = true,
  doneCallback,
  baseDelay = 0,
  children,
}: TypewriterAnimationProps): ReactElement {
  const controls = useAnimation();

  const variants: Variants = {
    hidden: { opacity: 0, x: -12 },
    visible: { opacity: 1, x: 0 },
  };

  const transition: Transition = {
    duration: 0.16,
    ease: "linear",
  };

  useEffect(() => {
    if (shouldStart) {
      controls.start("visible").then(doneCallback);
    }
  }, [controls, shouldStart]);

  return (
    <>
      {children.split(" ").map((word, index) => (
        <motion.span
          className={styles.word}
          key={index}
          variants={variants}
          initial="hidden"
          animate={controls}
          transition={{ ...transition, delay: baseDelay + index * 0.016 }}
        >
          {word}{" "}
        </motion.span>
      ))}
    </>
  );
}
