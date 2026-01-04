import bcrypt from "bcryptjs";

import { ErrorDto } from "@/app/dto/error.dto";

import { RouteService } from "@/app/services/route.service";
import { ValidationService } from "@/app/services/validation.service";
import { db } from "@/db";
import { User, users } from "@/db/schema";

export async function POST(request: Request): Promise<Response> {
  return RouteService.handleError(async (): Promise<User | ErrorDto> => {
    const { email, name, password } = await request.json();
    ValidationService.throwIfInvalidEmail(email);
    await ValidationService.throwIfDuplicateEmail(email);
    ValidationService.throwIfInvalidName(name);
    ValidationService.throwIfInvalidPassword(password);

    const hashedPassword = await bcrypt.hash(password, 10);

    const rows = await db
      .insert(users)
      .values({
        email,
        name,
        password: hashedPassword,
      })
      .returning();

    return rows[0];
  });
}
