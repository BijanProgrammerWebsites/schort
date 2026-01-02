import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

export class PrismaService {
  private static _client: PrismaClient | null = null;

  public static get client(): PrismaClient {
    if (!this._client) {
      const adapter = new PrismaPg({
        connectionString: process.env.DATABASE_URL,
      });

      this._client = new PrismaClient({ adapter });
    }

    return this._client;
  }
}
