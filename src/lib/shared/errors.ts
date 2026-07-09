export type ProgramMetricsErrorCode =
  | "ANALYTICS_ERROR"
  | "REPORT_GENERATION_ERROR"
  | "EXPORT_ERROR"
  | "CONFIGURATION_ERROR"
  | "VALIDATION_ERROR";

export interface ProgramMetricsErrorOptions {
  code: ProgramMetricsErrorCode;
  message: string;
  cause?: unknown;
  context?: Record<string, unknown>;
}

export class ProgramMetricsError extends Error {
  code: ProgramMetricsErrorCode;
  context?: Record<string, unknown>;
  cause?: unknown;

  constructor(options: ProgramMetricsErrorOptions) {
    super(options.message);
    this.name = this.constructor.name;
    this.code = options.code;
    this.context = options.context;
    this.cause = options.cause;
  }
}

export class AnalyticsError extends ProgramMetricsError {
  constructor(message: string, context?: Record<string, unknown>, cause?: unknown) {
    super({ code: "ANALYTICS_ERROR", message, context, cause });
  }
}

export class ReportGenerationError extends ProgramMetricsError {
  constructor(message: string, context?: Record<string, unknown>, cause?: unknown) {
    super({ code: "REPORT_GENERATION_ERROR", message, context, cause });
  }
}

export class ExportError extends ProgramMetricsError {
  constructor(message: string, context?: Record<string, unknown>, cause?: unknown) {
    super({ code: "EXPORT_ERROR", message, context, cause });
  }
}

export class ConfigurationError extends ProgramMetricsError {
  constructor(message: string, context?: Record<string, unknown>, cause?: unknown) {
    super({ code: "CONFIGURATION_ERROR", message, context, cause });
  }
}

export class ValidationError extends ProgramMetricsError {
  constructor(message: string, context?: Record<string, unknown>, cause?: unknown) {
    super({ code: "VALIDATION_ERROR", message, context, cause });
  }
}

export function normalizeError(error: unknown): ProgramMetricsError {
  if (error instanceof ProgramMetricsError) return error;
  if (error instanceof Error) return new ProgramMetricsError({ code: "VALIDATION_ERROR", message: error.message, cause: error });
  return new ProgramMetricsError({ code: "VALIDATION_ERROR", message: "An unknown ProgramMetrics error occurred.", cause: error });
}
export interface UserFacingError {
  title: string;
  message: string;
  code: ProgramMetricsErrorCode;
  retryable: boolean;
}

export function toUserFacingError(error: unknown): UserFacingError {
  const normalized = normalizeError(error);
  const fallback = {
    title: "Something went wrong",
    message: "ProgramMetrics could not complete that action. Review your file and try again.",
    code: normalized.code,
    retryable: true
  };

  const messages: Partial<Record<ProgramMetricsErrorCode, UserFacingError>> = {
    VALIDATION_ERROR: { title: "Check your file setup", message: "The uploaded file or setup options need review before ProgramMetrics can continue.", code: "VALIDATION_ERROR", retryable: true },
    ANALYTICS_ERROR: { title: "Analysis could not finish", message: "ProgramMetrics could not analyze this file in the current session. Try a smaller preview or review the file structure.", code: "ANALYTICS_ERROR", retryable: true },
    REPORT_GENERATION_ERROR: { title: "Preview could not be assembled", message: "ProgramMetrics could not assemble this deliverable preview. Your uploaded file remains session-only.", code: "REPORT_GENERATION_ERROR", retryable: true },
    EXPORT_ERROR: { title: "Export is not available", message: "This output could not be exported. Check package access and try again.", code: "EXPORT_ERROR", retryable: true },
    CONFIGURATION_ERROR: { title: "Configuration needs review", message: "ProgramMetrics could not match the selected package or output level.", code: "CONFIGURATION_ERROR", retryable: false }
  };

  return messages[normalized.code] || fallback;
}
