import { redirect } from "next/navigation";

import { PrismaService } from "@/app/services/prisma.service";

const prisma = PrismaService.client;

export async function GET(
  request: Request,
  { params }: { params: { alias: string } },
): Promise<Response> {
  const link = await prisma.link.findUnique({ where: { alias: params.alias } });

  if (!link) {
    redirect("/");
  } else {
    redirect(link.original);
  }
}
