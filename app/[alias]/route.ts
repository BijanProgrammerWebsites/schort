import { redirect } from "next/navigation";

import { PrismaService } from "@/app/services/prisma.service";

const prisma = PrismaService.client;

export async function GET(
  request: Request,
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
