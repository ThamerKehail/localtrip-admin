// Maps API errors to localized messages.
// Newer backends send a machine-readable `code`; the current production backend
// does not, so codes are inferred from HTTP status + message as a fallback.

const CODE_KEYS = {
  INVALID_CREDENTIALS: 'errInvalidCredentials',
  ACCOUNT_DEACTIVATED: 'errAccountDeactivated',
  EMAIL_NOT_VERIFIED: 'errEmailNotVerified',
  ADMIN_ACCESS_REQUIRED: 'errAdminOnly',
  NOT_ADMIN: 'errAdminOnly',
  TOKEN_MISSING: 'errSessionExpired',
  TOKEN_INVALID: 'errSessionExpired',
  INVALID_REFRESH_TOKEN: 'errSessionExpired',
  NOT_FOUND: 'errNotFound',
  TOO_MANY_REQUESTS: 'errTooManyRequests',
};

const STATUS_KEYS = {
  401: 'errSessionExpired',
  403: 'errForbidden',
  404: 'errNotFound',
  429: 'errTooManyRequests',
};

/** Returns the backend `code`, or one inferred from status/message when absent. */
export function resolveErrorCode(err) {
  if (err?.appCode) return err.appCode;
  const res = err?.response;
  if (!res) return null;
  const data = res.data || {};
  if (data.code) return data.code;

  const msg = String(data.message || '');
  const url = String(err.config?.url || '');
  if (res.status === 401 && url.includes('/auth/login')) return 'INVALID_CREDENTIALS';
  if (res.status === 403 && /deactivat/i.test(msg)) return 'ACCOUNT_DEACTIVATED';
  if (res.status === 403 && /admin access/i.test(msg)) return 'ADMIN_ACCESS_REQUIRED';
  if (res.status === 403 && /verify your email/i.test(msg)) return 'EMAIL_NOT_VERIFIED';
  if (res.status === 422) return 'VALIDATION_ERROR';
  return null;
}

const validationMessages = (data) =>
  Array.isArray(data?.errors)
    ? data.errors.map((e) => e?.message).filter(Boolean)
    : [];

/**
 * Localized, user-facing message for an API (axios) error.
 * Order: known code -> known HTTP status -> 422 field messages -> backend
 * message -> generic.
 */
export function getErrorMessage(err, t, fallbackKey = 'errGeneric') {
  if (!err) return t(fallbackKey);
  const res = err.response;

  if (!res && !err.appCode) {
    // Axios network/timeout errors have a request but no response.
    if (err.request || err.code === 'ECONNABORTED' || err.code === 'ERR_NETWORK') return t('errNetwork');
    return t(fallbackKey);
  }

  const code = resolveErrorCode(err);
  if (code && CODE_KEYS[code]) return t(CODE_KEYS[code]);

  const data = res?.data || {};
  if (code === 'VALIDATION_ERROR') {
    const msgs = validationMessages(data);
    if (msgs.length) return msgs.join(' · ');
  }

  if (res && STATUS_KEYS[res.status]) return t(STATUS_KEYS[res.status]);
  if (res && res.status >= 500) return t('errServer');
  if (data.message) return data.message;
  return t(fallbackKey);
}
