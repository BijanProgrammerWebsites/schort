import { PrismaClient } from "@prisma/client";

export class PrismaService {
  private static _client: PrismaClient | null = null;

  public static get client(): PrismaClient {
    if (!this._client) {
      this._client = new PrismaClient();
    }

    return this._client;
  }
}
