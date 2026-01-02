import { redirect } from "next/navigation";

import { prisma } from "@/app/lib/prisma";

export async function GET(
  _: Request,
  { params }: RouteContext<"/[alias]">,
): Promise<Response> {
  const { alias } = await params;
  const link = await prisma.link.findUnique({ where: { alias } });

  if (!link) {
    redirect("/");
  } else {
    redirect(link.original);
  }
}
