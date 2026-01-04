import { redirect } from "next/navigation";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { links } from "@/db/schema";

export async function GET(_: Request, { params }: any): Promise<Response> {
  const { alias } = await params;

  const link = await db.query.links.findFirst({
    where: eq(links.alias, alias),
  });

  if (!link) {
    redirect("/");
  } else {
    redirect(link.original);
  }
}
