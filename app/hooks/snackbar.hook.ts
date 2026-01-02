import { useCallback, useContext } from "react";

import { SnackbarContext } from "@/app/context/snackbar.context";
import { SnackbarModel } from "@/app/models/snackbar.model";

export function useSnackbar(): {
  addSnackbar: (snackbar: SnackbarModel) => void;
} {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar was called outside SnackbarProvider");
  }

  const addSnackbar = useCallback(
    (snackbar: SnackbarModel) => {
      snackbar.timeoutId = setTimeout(() => {
        context.dispatch({
          type: "REMOVE_SNACKBAR",
          payload: { id: snackbar.id },
        });
      }, 3000);

      context.dispatch({ type: "ADD_SNACKBAR", payload: { snackbar } });
    },
    [context],
  );

  return { addSnackbar };
}
