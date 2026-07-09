import type { DataRow, DescriptiveStatsProfile, FieldProfile, TopValue } from "./types";
import { getMissingCodes, isMissingValue, normalizeValue } from "./setupRows";

function quantile(values: number[], q: number): number | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  return sorted[base + 1] === undefined ? sorted[base] : sorted[base] + rest * (sorted[base + 1] - sorted[base]);
}

function topValues(values: string[], total: number): TopValue[] {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([value, count]) => ({ value, count, percent: total ? count / total : 0 }));
}

function monthKey(date: Date): string { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; }
function quarterKey(date: Date): string { return `${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}`; }

export function calculateDescriptiveStatistics(rows: DataRow[], fieldProfiles: FieldProfile[], setupConfig = {}): DescriptiveStatsProfile {
  const missingCodes = getMissingCodes(setupConfig);
  const numeric = fieldProfiles.filter((field) => field.type === "numeric").map((field) => {
    const values = rows.map((row) => normalizeValue(row[field.fieldName])).filter((value) => !isMissingValue(value, missingCodes)).map((value) => Number(value.replace(/[$,%]/g, ""))).filter(Number.isFinite);
    const count = values.length;
    const mean = count ? values.reduce((sum, value) => sum + value, 0) / count : null;
    const median = quantile(values, 0.5);
    const q1 = quantile(values, 0.25);
    const q3 = quantile(values, 0.75);
    const iqr = q1 !== null && q3 !== null ? q3 - q1 : null;
    const variance = mean === null || count < 2 ? null : values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (count - 1);
    const lower = q1 !== null && iqr !== null ? q1 - 1.5 * iqr : null;
    const upper = q3 !== null && iqr !== null ? q3 + 1.5 * iqr : null;
    const outlierCount = lower === null || upper === null ? 0 : values.filter((value) => value < lower || value > upper).length;
    return { fieldName: field.fieldName, count, missing: field.missingCount, min: count ? Math.min(...values) : null, max: count ? Math.max(...values) : null, mean, median, standardDeviation: variance === null ? null : Math.sqrt(variance), q1, q3, iqr, outlierCount, outlierPercent: count ? outlierCount / count : 0 };
  });

  const categorical = fieldProfiles.filter((field) => field.type === "categorical" || field.type === "boolean").map((field) => {
    const values = rows.map((row) => normalizeValue(row[field.fieldName])).filter((value) => !isMissingValue(value, missingCodes));
    const top = topValues(values, values.length);
    const topValuePercent = top[0]?.percent || 0;
    return { fieldName: field.fieldName, uniqueCount: new Set(values).size, topValues: top, topValuePercent, concentration: topValuePercent > 0.7 ? "high" as const : topValuePercent > 0.4 ? "moderate" as const : "low" as const, recommendedChartType: top.length <= 6 ? "donut" as const : "horizontalBar" as const };
  });

  const date = fieldProfiles.filter((field) => field.type === "date").map((field) => {
    const parsed = rows.map((row) => new Date(normalizeValue(row[field.fieldName]))).filter((value) => !Number.isNaN(value.getTime()));
    const recordsByMonth: Record<string, number> = {};
    const recordsByQuarter: Record<string, number> = {};
    const recordsByYear: Record<string, number> = {};
    parsed.forEach((value) => {
      recordsByMonth[monthKey(value)] = (recordsByMonth[monthKey(value)] || 0) + 1;
      recordsByQuarter[quarterKey(value)] = (recordsByQuarter[quarterKey(value)] || 0) + 1;
      recordsByYear[String(value.getFullYear())] = (recordsByYear[String(value.getFullYear())] || 0) + 1;
    });
    const min = parsed.length ? new Date(Math.min(...parsed.map((value) => value.getTime()))) : null;
    const max = parsed.length ? new Date(Math.max(...parsed.map((value) => value.getTime()))) : null;
    return { fieldName: field.fieldName, earliest: min ? min.toISOString().slice(0, 10) : null, latest: max ? max.toISOString().slice(0, 10) : null, dateRangeDays: min && max ? Math.round((max.getTime() - min.getTime()) / 86400000) : null, recordsByMonth, recordsByQuarter, recordsByYear, parseSuccessRate: field.parseSuccessRate };
  });

  return { numeric, categorical, date };
}
