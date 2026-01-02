import { ErrorDto } from "@/app/dto/error.dto";
import { Session, User } from "next-auth";
import { prisma } from "@/app/lib/prisma";

export class ValidationService {
  public static throwIfNotLoggedIn(
    session: Session | null,
  ): asserts session is Required<
    Session & { user: User & { email: Required<string> } }
  > {
    if (!session?.user?.email) {
      throw new ErrorDto("You have to log in first.");
    }
  }

  public static throwIfInvalidEmail(value: string): void {
    const pattern =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!pattern.test(value)) {
      throw new ErrorDto("Email has to be valid.");
    }
  }

  public static async throwIfDuplicateEmail(value: string): Promise<void> {
    const duplicate = await prisma.user.findFirst({ where: { email: value } });
    if (duplicate) {
      throw new ErrorDto("Email has used before.");
    }
  }

  public static throwIfInvalidName(value: string): void {
    if (value.length < 3 || 16 < value.length) {
      throw new ErrorDto("Name has to contain 3 to 16 characters.");
    }

    if (!/^[a-zA-Z0-9\-]{3,16}$/.test(value)) {
      throw new ErrorDto(
        "Name can only contain lowercase letters (a-z), uppercase letters (A-Z), digits (0-9) and hyphens (-).",
      );
    }
  }

  public static throwIfInvalidPassword(value: string): void {
    if (value.length < 8 || 16 < value.length) {
      throw new ErrorDto("Password has to contain 8 to 16 characters.");
    }

    if (!/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).{8,16}$/.test(value)) {
      throw new ErrorDto(
        "Password has to contain at least one lowercase letter (a-z), one uppercase letter (A-Z) and one digit (0-9).",
      );
    }
  }

  public static throwIfInvalidLinkId(value: string): void {
    if (!value) {
      throw new ErrorDto("Link ID is required");
    }
  }

  public static throwIfInvalidUrl(value: string): void {
    try {
      new URL(value);
    } catch {
      throw new ErrorDto("Link has to be a valid URL.");
    }
  }

  public static throwIfInvalidAlias(value: string): void {
    if (value.length < 3 || 32 < value.length) {
      throw new ErrorDto("Alias has to contain 3 to 32 characters.");
    }

    if (!/^[a-z0-9\-]{3,32}$/.test(value)) {
      throw new ErrorDto(
        "Alias can only contain lowercase letters (a-z), digits (0-9) and hyphens (-).",
      );
    }
  }

  public static async throwIfDuplicateAlias(value: string): Promise<void> {
    const duplicate = await prisma.link.findFirst({ where: { alias: value } });
    if (duplicate) {
      throw new ErrorDto("Alias has used before.");
    }
  }
}
