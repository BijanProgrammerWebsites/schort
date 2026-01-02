"use client";

import { ReactElement, ReactNode, useEffect, useRef } from "react";

import {
  motion,
  Transition,
  useAnimation,
  useInView,
  Variants,
} from "framer-motion";

interface FadeAnimationProps {
  shouldStart?: boolean;
  waitUntilComeIntoView?: boolean;
  doneCallback?: () => void;
  baseDelay?: number;
  children: ReactNode;
}

export default function FadeAnimation({
  shouldStart = true,
  waitUntilComeIntoView = false,
  doneCallback,
  baseDelay = 0,
  children,
}: FadeAnimationProps): ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const controls = useAnimation();

  const variants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const transition: Transition = {
    duration: 0.36,
    ease: [0.48, 0, 0.16, 1],
    delay: baseDelay,
  };

  useEffect(() => {
    if (shouldStart && (!waitUntilComeIntoView || isInView)) {
      controls.start("visible").then(doneCallback);
    }
  }, [controls, shouldStart, waitUntilComeIntoView, isInView]);

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={controls}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
