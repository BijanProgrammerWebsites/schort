import { ReactElement } from "react";

import { redirect } from "next/navigation";

import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/options";

import AuthFormComponent from "@/app/auth/form/auth-form.component";

export default async function AuthPage(): Promise<ReactElement> {
  const session = await getServerSession(nextAuthOptions);

  if (session?.user?.email) {
    redirect("/");
  }

  return <AuthFormComponent />;
}
