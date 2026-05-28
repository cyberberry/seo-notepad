import "server-only";
import pino, { type Logger as PinoLogger } from "pino";
import pinoPretty from "pino-pretty";

export type LogLevel = "debug" | "info" | "warn" | "error";
export type LogContext = Record<string, unknown>;

export type Logger = {
  debug: (message: string, context?: LogContext) => void;
  info: (message: string, context?: LogContext) => void;
  warn: (message: string, context?: LogContext) => void;
  error: (message: string, context?: LogContext) => void;
  errorWithCause: (
    message: string,
    error: unknown,
    context?: LogContext,
  ) => void;
};

function resolveLevel(): LogLevel {
  const raw = process.env.LOG_LEVEL?.toLowerCase();
  const levels: LogLevel[] = ["debug", "info", "warn", "error"];
  if (raw && levels.includes(raw as LogLevel)) {
    return raw as LogLevel;
  }
  return process.env.NODE_ENV === "production" ? "info" : "debug";
}

function serializeError(error: unknown): LogContext {
  if (error instanceof Error) {
    return {
      err: {
        type: error.name,
        message: error.message,
        ...(process.env.NODE_ENV !== "production" && error.stack
          ? { stack: error.stack }
          : {}),
      },
    };
  }
  return { err: { message: String(error) } };
}

function wrapPino(child: PinoLogger): Logger {
  return {
    debug: (message, context) => child.debug(context ?? {}, message),
    info: (message, context) => child.info(context ?? {}, message),
    warn: (message, context) => child.warn(context ?? {}, message),
    error: (message, context) => child.error(context ?? {}, message),
    errorWithCause: (message, error, context) =>
      child.error({ ...context, ...serializeError(error) }, message),
  };
}

function createRootLogger(): PinoLogger {
  const level = resolveLevel();
  const isDev = process.env.NODE_ENV !== "production";

  if (isDev) {
    // sync stream avoids worker-thread issues with Next.js / Turbopack
    return pino(
      { level, base: { env: "server" } },
      pinoPretty({
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
        sync: true,
      }),
    );
  }

  return pino({
    level,
    base: { env: "server" },
  });
}

const rootLogger = createRootLogger();

/** Scoped server logger (Pino child). */
export function createLogger(scope: string): Logger {
  return wrapPino(rootLogger.child({ scope }));
}

/** Default server logger for modules without a dedicated scope. */
export const logger = createLogger("app");
