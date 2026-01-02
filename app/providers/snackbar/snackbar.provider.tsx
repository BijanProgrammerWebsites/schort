"use client";

import { ReactElement, ReactNode, useReducer } from "react";

import { SnackbarContext } from "@/app/context/snackbar.context";
import SnackbarComponent from "@/app/components/snackbar/snackbar.component";
import snackbarReducer from "@/app/reducers/snackbar.reducer";

import styles from "./snackbar.module.scss";

export default function SnackbarProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const [{ queue }, dispatch] = useReducer(snackbarReducer, { queue: [] });

  return (
    <SnackbarContext.Provider value={{ queue, dispatch }}>
      <ul className={styles.snackbars}>
        {queue.map((snackbar) => (
          <SnackbarComponent key={snackbar.id} variant={snackbar.variant}>
            {snackbar.message}
          </SnackbarComponent>
        ))}
      </ul>

      {children}
    </SnackbarContext.Provider>
  );
}
