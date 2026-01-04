import { NextResponse } from "next/server";

import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/options";

import crypto from "crypto";

import { ErrorDto } from "@/app/dto/error.dto";

import { RouteService } from "@/app/services/route.service";
import { ValidationService } from "@/app/services/validation.service";

import { db } from "@/db";
import { Link, links, users } from "@/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { QueryResult } from "pg";

export async function GET(): Promise<NextResponse<Link[] | ErrorDto>> {
  return RouteService.handleError(async (): Promise<Link[] | ErrorDto> => {
    const session = await getServerSession(nextAuthOptions);
    if (!session?.user?.email) {
      return [];
    }

    return db.query.links.findMany({
      with: { user: true },
      where: eq(users.email, session.user.email),
      orderBy: desc(links.updatedAt),
    });
  });
}

export async function POST(
  request: Request,
): Promise<NextResponse<Link | ErrorDto>> {
  return RouteService.handleError(async (): Promise<Link | ErrorDto> => {
    const parameters = await request.json();

    const original = parameters.original;
    ValidationService.throwIfInvalidUrl(original);

    const alias = parameters.alias || crypto.randomBytes(4).toString("hex");
    ValidationService.throwIfInvalidAlias(alias);
    await ValidationService.throwIfDuplicateAlias(alias);

    const session = await getServerSession(nextAuthOptions);
    if (!session?.user?.email) {
      return (await db.insert(links).values({ original, alias })).rows[0];
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });

    return (
      await db.insert(links).values({
        original,
        alias,
        userId: user?.id ?? null,
      })
    ).rows[0];
  });
}

export async function PUT(
  request: Request,
): Promise<NextResponse<Link | ErrorDto>> {
  return RouteService.handleError(async (): Promise<Link | ErrorDto> => {
    const { id, alias } = await request.json();
    ValidationService.throwIfInvalidLinkId(id);
    ValidationService.throwIfInvalidAlias(alias);
    await ValidationService.throwIfDuplicateAlias(alias);

    const session = await getServerSession(nextAuthOptions);
    ValidationService.throwIfNotLoggedIn(session);

    const link = await db.query.links.findFirst({
      with: { user: true },
      where: eq(links.id, id),
    });

    if (!link?.user || link.user.email !== session.user.email) {
      throw new ErrorDto("The link does not belong to the user.");
    }

    return (await db.update(links).set({ alias }).where(eq(links.id, link.id)))
      .rows[0];
  });
}

export async function DELETE(request: Request): Promise<Response> {
  return RouteService.handleError(async (): Promise<QueryResult | ErrorDto> => {
    const { id } = await request.json();
    ValidationService.throwIfInvalidLinkId(id);

    const session = await getServerSession(nextAuthOptions);
    ValidationService.throwIfNotLoggedIn(session);

    return db
      .delete(links)
      .where(
        and(
          eq(links.id, id),
          eq(
            links.userId,
            sql`(SELECT id FROM users WHERE email = ${session.user.email})`,
          ),
        ),
      );
  });
}
