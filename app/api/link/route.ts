import { NextResponse } from "next/server";

import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/options";

import { Link, Prisma } from "@prisma/client";

import crypto from "crypto";

import { ErrorDto } from "@/app/dto/error.dto";

import { RouteService } from "@/app/services/route.service";
import { ValidationService } from "@/app/services/validation.service";

import { prisma } from "@/app/lib/prisma";

export async function GET(): Promise<NextResponse<Link[] | ErrorDto>> {
  return RouteService.handleError(async (): Promise<Link[] | ErrorDto> => {
    const session = await getServerSession(nextAuthOptions);
    if (!session?.user?.email) {
      return [];
    }

    return prisma.link.findMany({
      where: { user: { email: session.user.email } },
      orderBy: { updatedAt: "desc" },
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
      return prisma.link.create({ data: { original, alias } });
    }
    return prisma.link.create({
      data: {
        original,
        alias,
        user: { connect: { email: session.user.email } },
      },
    });
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

    const link = await prisma.link.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!link?.user || link.user.email !== session.user.email) {
      throw new ErrorDto("The link does not belong to the user.");
    }

    return prisma.link.update({ where: { id: link.id }, data: { alias } });
  });
}

export async function DELETE(request: Request): Promise<Response> {
  return RouteService.handleError(
    async (): Promise<Prisma.BatchPayload | ErrorDto> => {
      const { id } = await request.json();
      ValidationService.throwIfInvalidLinkId(id);

      const session = await getServerSession(nextAuthOptions);
      ValidationService.throwIfNotLoggedIn(session);

      return prisma.link.deleteMany({
        where: {
          AND: [
            {
              id,
            },
            {
              user: { email: session.user.email },
            },
          ],
        },
      });
    },
  );
}
