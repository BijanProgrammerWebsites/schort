"use client";

import { ReactElement, ReactNode, useReducer } from "react";

import {
  AnimationContext,
  defaultContextValue,
} from "@/app/context/animation.context";
import animationReducer from "@/app/reducers/animation.reducer";

export default function AnimationProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const [{ animationStatus }, dispatch] = useReducer(animationReducer, {
    animationStatus: defaultContextValue.animationStatus,
  });

  return (
    <AnimationContext.Provider value={{ animationStatus, dispatch }}>
      {children}
    </AnimationContext.Provider>
  );
}
