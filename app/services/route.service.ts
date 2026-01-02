import { NextResponse } from "next/server";

import { ErrorDto } from "@/app/dto/error.dto";

export class RouteService {
  public static async handleError<ResultType>(
    callback: () => Promise<ResultType & Exclude<ResultType, void>>,
  ): Promise<NextResponse<ResultType | ErrorDto>> {
    try {
      const result = await callback();
      return NextResponse.json(result);
    } catch (error) {
      if (error instanceof ErrorDto) {
        return NextResponse.json(error, { status: 400 });
      }

      return NextResponse.json(new ErrorDto(JSON.stringify(error)), {
        status: 500,
      });
    }
  }
}
