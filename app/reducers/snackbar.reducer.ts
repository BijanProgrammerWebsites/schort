import { SnackbarIdEnum } from "@/app/enums/snackbar-id.enum";

import { SnackbarModel } from "@/app/models/snackbar.model";

interface SnackbarState {
  queue: SnackbarModel[];
}

export type SnackbarAction =
  | {
      type: "ADD_SNACKBAR";
      payload: {
        snackbar: SnackbarModel;
      };
    }
  | {
      type: "REMOVE_SNACKBAR";
      payload: {
        id: SnackbarIdEnum;
      };
    };

export default function snackbarReducer(
  currentState: SnackbarState,
  action: SnackbarAction,
): SnackbarState {
  switch (action.type) {
    case "ADD_SNACKBAR": {
      const snackbarWithTheSameId = currentState.queue.find(
        (x) => x.id === action.payload.snackbar.id,
      );
      if (!!snackbarWithTheSameId) {
        clearTimeout(snackbarWithTheSameId.timeoutId);
      }

      const restOfTheQueue = currentState.queue.filter(
        (x) => x.id !== action.payload.snackbar.id,
      );
      return { queue: [action.payload.snackbar, ...restOfTheQueue] };
    }
    case "REMOVE_SNACKBAR": {
      const restOfTheQueue = currentState.queue.filter(
        (x) => x.id !== action.payload.id,
      );
      return { queue: restOfTheQueue };
    }
    default:
      throw new Error("Unknown action type");
  }
}
