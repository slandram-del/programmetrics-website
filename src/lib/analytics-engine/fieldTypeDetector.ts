import type { FieldType } from "./types";
import { normalizeValue } from "./setupRows";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^(\+?1[-.\s]?)?(\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}$/;

function ratio(count: number, total: number): number {
  return total === 0 ? 0 : count / total;
}

export function detectFieldType(fieldName: string, values: unknown[]): { type: FieldType; parseSuccessRate: number; warnings: string[] } {
  const normalized = values.map(normalizeValue).filter(Boolean);
  const total = normalized.length;
  const name = fieldName.toLowerCase();
  if (total === 0) return { type: "unknown", parseSuccessRate: 0, warnings: ["Field has no non-missing values."] };

  const uniqueCount = new Set(normalized).size;
  const dateCount = normalized.filter((value) => !Number.isNaN(Date.parse(value)) && /date|time|day|month|year|\d{1,4}[/-]\d{1,2}/i.test(`${name} ${value}`)).length;
  const numericCount = normalized.filter((value) => value !== "" && Number.isFinite(Number(String(value).replace(/[$,%]/g, "")))).length;
  const emailCount = normalized.filter((value) => emailPattern.test(value)).length;
  const phoneCount = normalized.filter((value) => phonePattern.test(value)).length;
  const booleanCount = normalized.filter((value) => /^(yes|no|true|false|0|1|y|n)$/i.test(value)).length;
  const avgLength = normalized.reduce((sum, value) => sum + value.length, 0) / total;

  if (/email/.test(name) || ratio(emailCount, total) >= 0.8) return { type: "email", parseSuccessRate: ratio(emailCount, total), warnings: [] };
  if (/phone|mobile|cell/.test(name) || ratio(phoneCount, total) >= 0.8) return { type: "phone", parseSuccessRate: ratio(phoneCount, total), warnings: [] };
  if (/lat|lon|address|city|state|zip|county|location/.test(name)) return { type: "location", parseSuccessRate: 1, warnings: [] };
  if (/(^|_)(id|uuid|key)$|record|reference|responseid|client id|participant id/.test(name) && uniqueCount / total > 0.65) return { type: "id", parseSuccessRate: uniqueCount / total, warnings: [] };
  if (ratio(dateCount, total) >= 0.7) return { type: "date", parseSuccessRate: ratio(dateCount, total), warnings: [] };
  if (ratio(numericCount, total) >= 0.85) return { type: "numeric", parseSuccessRate: ratio(numericCount, total), warnings: [] };
  if (ratio(booleanCount, total) >= 0.85) return { type: "boolean", parseSuccessRate: ratio(booleanCount, total), warnings: [] };
  if (avgLength > 80 || uniqueCount / total > 0.75) return { type: "text", parseSuccessRate: 1, warnings: [] };
  if (uniqueCount <= Math.min(50, Math.max(8, total * 0.35))) return { type: "categorical", parseSuccessRate: 1, warnings: [] };
  return { type: "text", parseSuccessRate: 1, warnings: ["High-cardinality text is not recommended as a category chart."] };
}
