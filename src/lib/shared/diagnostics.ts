export type DiagnosticEventType = "engine" | "service" | "chart" | "report" | "warning" | "error";

export interface DiagnosticEvent {
  type: DiagnosticEventType;
  name: string;
  startedAt: number;
  durationMs?: number;
  details?: Record<string, unknown>;
}

export interface DiagnosticsSink {
  record(event: DiagnosticEvent): void;
  list(): DiagnosticEvent[];
  clear(): void;
}

class MemoryDiagnosticsSink implements DiagnosticsSink {
  private events: DiagnosticEvent[] = [];

  record(event: DiagnosticEvent): void {
    this.events.push(event);
  }

  list(): DiagnosticEvent[] {
    return [...this.events];
  }

  clear(): void {
    this.events = [];
  }
}

export const diagnostics = new MemoryDiagnosticsSink();

function now(): number {
  return typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now();
}

export function recordDiagnostic(type: DiagnosticEventType, name: string, details?: Record<string, unknown>): DiagnosticEvent {
  const event = { type, name, startedAt: now(), details };
  diagnostics.record(event);
  return event;
}

export function timeDiagnostic<T>(type: DiagnosticEventType, name: string, callback: () => T, details?: Record<string, unknown>): T {
  const startedAt = now();
  try {
    const result = callback();
    diagnostics.record({ type, name, startedAt, durationMs: Math.round(now() - startedAt), details });
    return result;
  } catch (error) {
    diagnostics.record({ type: "error", name, startedAt, durationMs: Math.round(now() - startedAt), details: { ...(details || {}), error: error instanceof Error ? error.message : String(error) } });
    throw error;
  }
}
