import { Dispatch, createContext } from "react";

import { SnackbarModel } from "@/app/models/snackbar.model";
import { SnackbarAction } from "@/app/reducers/snackbar.reducer";

export const SnackbarContext = createContext<{
  queue: SnackbarModel[];
  dispatch: Dispatch<SnackbarAction>;
}>({
  queue: [],
  dispatch: () => {},
});
