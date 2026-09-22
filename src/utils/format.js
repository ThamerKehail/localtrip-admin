// Shared display formatters. Values are formatted only at render time; the
// API's DECIMAL strings (e.g. "150.00") are never used for arithmetic here.
// Western (latn) digits and the Gregorian calendar are forced for Arabic,
// because ar-SA otherwise defaults to Arabic-Indic digits and Hijri dates.
const LOCALES = {
  ar: 'ar-SA-u-ca-gregory-nu-latn',
  en: 'en-SA-u-ca-gregory-nu-latn',
};

const localeFor = (lang) => LOCALES[lang] || LOCALES.en;

const isBlank = (v) => v === null || v === undefined || v === '';

export function formatSAR(value, lang = 'en') {
  if (isBlank(value)) return '—';
  const n = Number(value);
  if (!Number.isFinite(n)) return '—';
  return new Intl.NumberFormat(localeFor(lang), {
    style: 'currency',
    currency: 'SAR',
    numberingSystem: 'latn',
  }).format(n);
}

export function formatNumber(value, lang = 'en') {
  const n = Number(value);
  if (isBlank(value) || !Number.isFinite(n)) return '0';
  return new Intl.NumberFormat(localeFor(lang), { numberingSystem: 'latn' }).format(n);
}

// "YYYY-MM-DD" (DATEONLY) is parsed as a local calendar date; new Date('2026-01-05')
// would be UTC midnight and can render as the previous day west of UTC.
const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

const toDate = (value) => {
  if (value instanceof Date) return value;
  const m = typeof value === 'string' ? DATE_ONLY.exec(value) : null;
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return new Date(value);
};

export function formatDate(value, lang = 'en', options = { day: '2-digit', month: 'short', year: 'numeric' }) {
  if (isBlank(value)) return '—';
  const d = toDate(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return new Intl.DateTimeFormat(localeFor(lang), options).format(d);
}
