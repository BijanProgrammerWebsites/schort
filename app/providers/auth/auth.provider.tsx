"use client";

import { ReactElement, ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

export default function AuthProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return <SessionProvider>{children}</SessionProvider>;
}
