// Reusable error handling utilities for React + RTK Query (TypeScript)
// ---------------------------------------------------------------
// File: src/utils/errorHandling.ts
// Totalmente tipizzato, senza "any". Adatto a RTK Query, Axios-like errors e fallback generici.

import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

// ---------------------------------------------------------------
// Types
// ---------------------------------------------------------------
export type AppErrorStatus =
  | number
  | "FETCH_ERROR"
  | "PARSING_ERROR"
  | "CUSTOM_ERROR"
  | "TIMEOUT_ERROR"
  | "UNKNOWN_ERROR";

export type AppError = {
  message: string;
  status?: AppErrorStatus;
  code?: string | number;
  details?: unknown;
  raw?: unknown;
};

export type MessagesByStatus = Partial<Record<number, string>> &
  Partial<Record<Exclude<AppErrorStatus, number>, string>>;

export type HandleOptions = {
  /** Prefisso contestuale del messaggio, es. "modifica utente" */
  context?: string;
  /** Callback opzionale per la UI (toast, dialog, ecc.) */
  onError?: (appError: AppError) => void;
  /** Se true rilancia un Error pulito per il chiamante (default: true) */
  rethrow?: boolean;
  /** Logger personalizzabile (default: console.error) */
  logger?: (appError: AppError) => void;
  /** Messaggi custom per status specifici (HTTP o RTK speciali) */
  messagesByStatus?: MessagesByStatus;
  /** Messaggio di fallback se non c'è nulla di più specifico */
  fallbackMessage?: string;
};

export type ToastFn = (msg: string) => void;

// ---------------------------------------------------------------
// Type guards & helpers
// ---------------------------------------------------------------
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return isRecord(error) && "status" in error;
}

function isSerializedError(error: unknown): error is SerializedError {
  if (!isRecord(error)) return false;
  const e = error as Partial<SerializedError>;
  return (
    typeof e.name === "string" ||
    typeof e.message === "string" ||
    typeof e.stack === "string" ||
    typeof (e as { code?: unknown }).code === "string"
  );
}

interface AxiosLikeResponse {
  status?: number;
  data?: unknown;
}
interface AxiosLikeError {
  response?: AxiosLikeResponse;
}

function hasAxiosResponse(error: unknown): error is AxiosLikeError {
  return (
    isRecord(error) &&
    "response" in error &&
    isRecord((error as { response: unknown }).response)
  );
}

// Try to extract a human-friendly message from typical API payloads
function pickMessageFromData(data: unknown): {
  message?: string;
  code?: string | number;
  details?: unknown;
} {
  if (typeof data === "string") return { message: data };
  if (isRecord(data)) {
    const obj = data as Record<string, unknown>;

    // Common backends
    const candidates = [obj.detail, obj.message, obj.error, obj.title, obj.msg];
    const firstString = candidates.find((c) => typeof c === "string");
    if (typeof firstString === "string")
      return { message: firstString, details: obj };

    // Validation styles
    const errors = (obj.errors ??
      obj.fieldErrors ??
      obj.validation ??
      obj.issues) as unknown;

    if (Array.isArray(errors)) {
      const message = errors
        .map((e) =>
          isRecord(e)
            ? typeof e.msg === "string"
              ? e.msg
              : typeof e.message === "string"
              ? e.message
              : JSON.stringify(e)
            : String(e)
        )
        .join(" • ");
      return { message, details: obj };
    }

    if (isRecord(errors)) {
      const flat = Object.entries(errors).map(([k, v]) => {
        let text: string;
        if (Array.isArray(v)) {
          text = v
            .map((item) =>
              isRecord(item)
                ? typeof item.msg === "string"
                  ? item.msg
                  : typeof item.message === "string"
                  ? item.message
                  : JSON.stringify(item)
                : String(item)
            )
            .join(", ");
        } else if (isRecord(v)) {
          text =
            (typeof v.msg === "string" && v.msg) ||
            (typeof v.message === "string" && v.message) ||
            JSON.stringify(v);
        } else {
          text = String(v);
        }
        return `${k}: ${text}`;
      });
      return { message: flat.join(" • "), details: obj };
    }

    return {
      message:
        typeof obj.detail === "string"
          ? obj.detail
          : typeof obj.message === "string"
          ? obj.message
          : undefined,
      code:
        typeof obj.code === "string" || typeof obj.code === "number"
          ? (obj.code as string | number)
          : typeof obj.errorCode === "string" ||
            typeof obj.errorCode === "number"
          ? (obj.errorCode as string | number)
          : undefined,
      details: obj,
    };
  }
  return {};
}

function getStatusOverride(
  messagesByStatus: MessagesByStatus | undefined,
  status: AppErrorStatus | undefined
): string | undefined {
  if (!messagesByStatus || typeof status === "undefined") return undefined;
  return typeof status === "number"
    ? messagesByStatus[status]
    : messagesByStatus[status];
}

function capitalize(s?: string): string {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ---------------------------------------------------------------
// Public API
// ---------------------------------------------------------------
export function toAppError(
  error: unknown,
  fallback = "Si è verificato un errore"
): AppError {
  try {
    if (isFetchBaseQueryError(error)) {
      const status = (error as FetchBaseQueryError)["status"] as AppErrorStatus;
      const data = (error as { data?: unknown }).data;
      const { message, code, details } = pickMessageFromData(data);

      let msg = message;
      if (!msg) {
        if (status === "FETCH_ERROR")
          msg = "Errore di rete. Verifica la connessione.";
        else if (status === "PARSING_ERROR")
          msg = "Risposta non valida dal server.";
        else if (status === "TIMEOUT_ERROR") msg = "Timeout della richiesta.";
      }
      return { message: msg ?? fallback, status, code, details, raw: error };
    }

    if (isSerializedError(error)) {
      const se = error as SerializedError & { data?: unknown };
      const { message, code, details } = pickMessageFromData(se.data);
      return {
        message: message ?? se.message ?? fallback,
        code,
        details,
        raw: error,
      };
    }

    if (error instanceof Error) {
      return { message: error.message || fallback, raw: error };
    }

    if (hasAxiosResponse(error)) {
      const status =
        typeof error.response?.status === "number"
          ? error.response.status
          : undefined;
      const { message, code, details } = pickMessageFromData(
        error.response?.data
      );
      return {
        message: message ?? fallback,
        status,
        code,
        details,
        raw: error,
      };
    }

    return { message: fallback, raw: error };
  } catch {
    return { message: fallback, raw: error };
  }
}

export function withErrorHandling<Args extends unknown[], R>(
  fn: (...args: Args) => Promise<R>,
  options: HandleOptions = {}
) {
  const {
    context,
    onError,
    rethrow = true,
    logger = (err) => console.error(`[${context ?? "Errore"}]`, err),
    messagesByStatus,
    fallbackMessage,
  } = options;

  return async (...args: Args): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      const appError = toAppError(
        error,
        fallbackMessage ?? "Qualcosa è andato storto"
      );

      const override = getStatusOverride(messagesByStatus, appError.status);
      if (override) appError.message = override;

      if (
        context &&
        appError.message &&
        !appError.message.toLowerCase().includes(context.toLowerCase())
      ) {
        appError.message = `${capitalize(context)}: ${appError.message}`;
      }

      (logger ?? (() => {}))(appError);
      onError?.(appError);

      if (rethrow) {
        throw new Error(appError.message);
      }

      // @ts-expect-error: intentionally returning undefined when rethrow=false
      return undefined;
    }
  };
}

export function makeToastErrorHandler(toast: ToastFn) {
  return (err: AppError): void => {
    toast(err.message);
  };
}

// Utility: ritorna una tupla [data, error] senza lanciare eccezioni
export async function safeCall<T>(
  work: () => Promise<T>
): Promise<[T | null, AppError | null]> {
  try {
    const data = await work();
    return [data, null];
  } catch (err) {
    return [null, toAppError(err)];
  }
}

// ---------------------------------------------------------------
// USAGE EXAMPLES (solo documentazione, non eseguito)
// ---------------------------------------------------------------
/*
import { useCallback } from "react";
import { toast } from "react-hot-toast";

// Esempio con RTK Query
const handleEditUser = useCallback(
  withErrorHandling(
    async (userData: Partial<User> & { id: number | string }) => {
      const { id, ...data } = userData;
      await updateUser({ id, data }).unwrap();
      refetch();
    },
    {
      context: "modifica utente",
      fallbackMessage: "Errore durante la modifica dell'utente",
      onError: makeToastErrorHandler((msg) => toast.error(msg)),
      messagesByStatus: {
        400: "Dati non validi.",
        401: "Non sei autenticato.",
        403: "Non hai i permessi necessari.",
        404: "Utente non trovato.",
        409: "Conflitto: l'utente esiste già o è in uso.",
        422: "Validazione fallita.",
        500: "Errore del server. Riprova più tardi.",
        FETCH_ERROR: "Impossibile contattare il server. Controlla la connessione.",
        TIMEOUT_ERROR: "Timeout della richiesta.",
      },
    }
  ),
  [updateUser, refetch]
);

// try/catch condiviso
try {
  await updateUser({ id, data }).unwrap();
} catch (err) {
  const appErr = toAppError(err, "Errore durante la modifica dell'utente");
  console.error(appErr);
  toast.error(appErr.message);
  throw new Error(appErr.message);
}

// safeCall
const [result, error] = await safeCall(() => updateUser({ id, data }).unwrap());
if (error) toast.error(error.message);
*/
