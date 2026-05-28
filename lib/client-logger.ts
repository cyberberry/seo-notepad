import pino, { type Logger as PinoLogger } from "pino";

type LogContext = Record<string, unknown>;

type ClientLogger = {
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

function serializeError(error: unknown): LogContext {
  if (error instanceof Error) {
    return {
      err: { type: error.name, message: error.message },
    };
  }
  return { err: { message: String(error) } };
}

function wrapPino(child: PinoLogger): ClientLogger {
  return {
    debug: (message, context) => child.debug(context ?? {}, message),
    info: (message, context) => child.info(context ?? {}, message),
    warn: (message, context) => child.warn(context ?? {}, message),
    error: (message, context) => child.error(context ?? {}, message),
    errorWithCause: (message, error, context) =>
      child.error({ ...context, ...serializeError(error) }, message),
  };
}

const rootLogger = pino({
  browser: { asObject: true },
  level: process.env.NODE_ENV === "production" ? "warn" : "debug",
  base: { env: "browser" },
});

/** Scoped client logger (Pino browser mode). */
export function createClientLogger(scope: string): ClientLogger {
  return wrapPino(rootLogger.child({ scope }));
}
