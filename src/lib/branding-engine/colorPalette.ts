const hexPattern = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export function isValidHexColor(value: string | undefined): boolean {
  return Boolean(value && hexPattern.test(value.trim()));
}

export function normalizeHexColor(value: string | undefined, fallback: string): string {
  const raw = String(value || "").trim();
  if (!isValidHexColor(raw)) return fallback;
  if (raw.length === 4) return `#${raw[1]}${raw[1]}${raw[2]}${raw[2]}${raw[3]}${raw[3]}`.toLowerCase();
  return raw.toLowerCase();
}

function hexToRgb(hex: string): [number, number, number] {
  const normalized = normalizeHexColor(hex, "#000000").slice(1);
  return [parseInt(normalized.slice(0, 2), 16), parseInt(normalized.slice(2, 4), 16), parseInt(normalized.slice(4, 6), 16)];
}

function rgbToHex(red: number, green: number, blue: number): string {
  return `#${[red, green, blue].map((value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0")).join("")}`;
}

function luminance(hex: string): number {
  const [red, green, blue] = hexToRgb(hex).map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function contrastRatio(foreground: string, background: string): number {
  const fg = luminance(foreground);
  const bg = luminance(background);
  const lighter = Math.max(fg, bg);
  const darker = Math.min(fg, bg);
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

export function readableTextColor(background: string): string {
  return contrastRatio("#0f172a", background) >= contrastRatio("#ffffff", background) ? "#0f172a" : "#ffffff";
}

export function tint(hex: string, amount = 0.18): string {
  const [red, green, blue] = hexToRgb(hex);
  return rgbToHex(red + (255 - red) * amount, green + (255 - green) * amount, blue + (255 - blue) * amount);
}

export function shade(hex: string, amount = 0.18): string {
  const [red, green, blue] = hexToRgb(hex);
  return rgbToHex(red * (1 - amount), green * (1 - amount), blue * (1 - amount));
}

export function generateChartPalette(primary: string, secondary: string, accent: string): string[] {
  const base = [primary, accent, secondary, shade(primary, 0.22), tint(accent, 0.28), shade(secondary, 0.1), "#7c3aed", "#f59e0b", "#0ea5e9", "#64748b"];
  return Array.from(new Set(base.map((color) => normalizeHexColor(color, "#2563eb"))));
}

export function suggestAccessibleTextColor(text: string, background: string): string {
  return contrastRatio(text, background) >= 4.5 ? text : readableTextColor(background);
}
