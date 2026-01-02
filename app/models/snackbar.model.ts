import { ReactNode } from "react";

import { SnackbarIdEnum } from "@/app/enums/snackbar-id.enum";
import { SnackbarVariantEnum } from "@/app/enums/snackbar-variant.enum";

export interface SnackbarModel {
  id: SnackbarIdEnum;
  variant: SnackbarVariantEnum;
  message: ReactNode;
  timeoutId?: ReturnType<typeof setTimeout>;
}
