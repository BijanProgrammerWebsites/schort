import { SnackbarIdEnum } from "@/app/enums/snackbar-id.enum";

export class ErrorDto {
  public constructor(
    public message: string,
    public snackbarId: SnackbarIdEnum = SnackbarIdEnum.SERVER_ERROR,
  ) {}
}
