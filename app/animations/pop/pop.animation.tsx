"use client";

import { ReactElement, ReactNode, useEffect, useRef } from "react";

import {
  motion,
  Transition,
  useAnimation,
  useInView,
  Variants,
} from "framer-motion";

interface PopAnimationProps {
  shouldStart?: boolean;
  waitUntilComeIntoView?: boolean;
  doneCallback?: () => void;
  baseDelay?: number;
  className?: string;
  children: ReactNode;
}

export default function PopAnimation({
  shouldStart = true,
  waitUntilComeIntoView = false,
  doneCallback,
  baseDelay = 0,
  className,
  children,
}: PopAnimationProps): ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);
  const controls = useAnimation();

  const variants: Variants = {
    hidden: { opacity: 0, scale: 0.64, transformOrigin: "center" },
    visible: { opacity: 1, scale: 1 },
  };

  const transition: Transition = {
    duration: 0.36,
    ease: [0.48, 0, 0.16, 1.6],
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
      className={className}
      variants={variants}
      initial="hidden"
      animate={controls}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
