import { signIn, SignInOptions, SignInResponse } from "next-auth/react";

import { ErrorDto } from "@/app/dto/error.dto";

import { SnackbarIdEnum } from "@/app/enums/snackbar-id.enum";
import { SnackbarVariantEnum } from "@/app/enums/snackbar-variant.enum";

import { useSnackbar } from "@/app/hooks/snackbar.hook";

type FetchDataType = <ResponseType>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  body?: unknown,
) => Promise<ResponseType | ErrorDto>;

type LogInType = (
  credentials: string,
  options?: SignInOptions,
) => Promise<SignInResponse | undefined | ErrorDto>;

const UNHANDLED_ERROR_MESSAGE =
  "An unhandled error occurred. Please try again later.";
const SYNTAX_ERROR_MESSAGE =
  "An error occurred while parsing server response. Please try again later.";

export function useApi(): { fetchData: FetchDataType; logIn: LogInType } {
  const { addSnackbar } = useSnackbar();

  const fetchData = async <ResultType, BodyType>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    body?: BodyType,
  ): Promise<ResultType | ErrorDto> => {
    return handleError(async (): Promise<ResultType | ErrorDto> => {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response?.ok) {
        return await response.json();
      }

      const error = await response.json();
      return new ErrorDto(error.message);
    });
  };

  const logIn = async (
    provider: string,
    options?: SignInOptions,
  ): Promise<SignInResponse | undefined | ErrorDto> => {
    return handleError(
      async (): Promise<SignInResponse | undefined | ErrorDto> => {
        const response = await signIn(provider, {
          ...options,
          callbackUrl: "/",
        });

        if (response === undefined || response?.ok) {
          return response;
        } else if (response.error) {
          return new ErrorDto(response.error, SnackbarIdEnum.LOGIN_FAIL);
        }

        return new ErrorDto(UNHANDLED_ERROR_MESSAGE);
      },
    );
  };

  const handleError = async <ResultType>(
    callback: () => Promise<ResultType>,
  ): Promise<ResultType | ErrorDto> => {
    const result = await (async (): Promise<ResultType | ErrorDto> => {
      try {
        return await callback();
      } catch (error) {
        if (error instanceof ErrorDto) {
          return error;
        }

        if (error instanceof SyntaxError) {
          return new ErrorDto(SYNTAX_ERROR_MESSAGE);
        }
      }

      return new ErrorDto(UNHANDLED_ERROR_MESSAGE);
    })();

    if (result instanceof ErrorDto) {
      addSnackbar({
        id: result.snackbarId,
        variant: SnackbarVariantEnum.DANGER,
        message: result.message,
      });
    }

    return result;
  };

  return {
    fetchData,
    logIn,
  };
}
