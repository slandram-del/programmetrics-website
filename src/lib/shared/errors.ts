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
