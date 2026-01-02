import bcrypt from "bcrypt";

import { User } from "@prisma/client";

import { ErrorDto } from "@/app/dto/error.dto";

import { RouteService } from "@/app/services/route.service";
import { ValidationService } from "@/app/services/validation.service";

import { prisma } from "@/app/lib/prisma";

export async function POST(request: Request): Promise<Response> {
  return RouteService.handleError(async (): Promise<User | ErrorDto> => {
    const { email, name, password } = await request.json();
    ValidationService.throwIfInvalidEmail(email);
    await ValidationService.throwIfDuplicateEmail(email);
    ValidationService.throwIfInvalidName(name);
    ValidationService.throwIfInvalidPassword(password);

    const hashedPassword = await bcrypt.hash(password, 10);
    return prisma.user.create({
      data: { email, name, password: hashedPassword },
    });
  });
}
