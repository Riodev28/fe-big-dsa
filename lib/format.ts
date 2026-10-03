// The backend stores UTC but may serialize datetimes without an offset;
// treat those as UTC instead of letting the browser assume local time.
const HAS_TIMEZONE = /(Z|[+-]\d{2}:?\d{2})$/i;

export function parseApiDate(iso: string): Date {
  return new Date(HAS_TIMEZONE.test(iso) ? iso : `${iso}Z`);
}

const dateFormat = new Intl.DateTimeFormat('en', { dateStyle: 'medium' });
const dateTimeFormat = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' });
// Months come as "YYYY-MM" with no day or time, so format in UTC to avoid shifting a month
const monthFormat = new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' });
const monthYearFormat = new Intl.DateTimeFormat('en', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatDate(iso: string): string {
  return dateFormat.format(parseApiDate(iso));
}

export function formatDateTime(iso: string): string {
  return dateTimeFormat.format(parseApiDate(iso));
}

function parseMonth(month: string): Date {
  const [year, monthIndex] = month.split('-').map(Number);
  return new Date(Date.UTC(year, monthIndex - 1, 1));
}

/** "2026-07" -> "Jul" */
export function formatMonth(month: string): string {
  return monthFormat.format(parseMonth(month));
}

/** "2026-07" -> "July 2026" */
export function formatMonthYear(month: string): string {
  return monthYearFormat.format(parseMonth(month));
}

export function formatDuration(ms: number): string {
  if (ms < 1) return '<1ms';
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString('en');
}

/** 12.5 -> "+12.5%", -3 -> "-3%" */
export function formatSignedPercent(value: number): string {
  return `${value > 0 ? '+' : ''}${value}%`;
}
