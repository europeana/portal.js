import createHttpError from 'http-errors';

const HTTP_CODES = {
  401: 'Unauthorised',
  403: 'Unauthorised',
  404: 'NotFound',
  423: 'Locked'
};

function normaliseErrorWithCode(errorOrCode, { scope = 'generic' } = {}) {
  let error;

  if (typeof errorOrCode === 'number') {
    errorOrCode = createHttpError(errorOrCode);
  }

  if (typeof errorOrCode === 'object') {
    error = errorOrCode;
    if (HTTP_CODES[error.statusCode]) {
      const httpCode = HTTP_CODES[error.statusCode]; // || 'UnknownError';
      error.code = `${scope}${httpCode}`;
    }
  } else {
    error = new Error;
    error.code = errorOrCode;
  }

  return error;
}

function translateErrorWithCode(error, { tValues = {} }) {
  // if (!this.$i18n.te(`errorMessage.${error.code}`)) {
  //   error.code = 'genericUnknownError';
  // }

  for (const tKey in (this.$i18n.t(`errorMessage.${error.code}`) || {})) {
    const tValuesForKey = tValues[tKey] || {};
    tValuesForKey.newline = '<br />';
    error[tKey] = this.$i18n.t(`errorMessage.${error.code}.${tKey}`, tValuesForKey);
  }

  if ((error.message === '') && error.title) {
    error.message = error.title;
  }

  return error;
}

// TODO: APM captureError?
export function handleError(errorOrCode, options = {}) {
  let error = normaliseErrorWithCode.bind(this)(errorOrCode, options);
  error = translateErrorWithCode.bind(this)(error, options);

  if (this.$nuxt?.context?.res && error.statusCode) {
    this.$nuxt.context.res.statusCode = error.statusCode;
  }

  if (!error.code || this.$fetchState?.pending) {
    throw error;
  }

  // TODO: rename to s'thing more generic like 'handle-non-fetch-error'?
  this.$root.$emit('show-error-modal', error);
}

export default (ctx, inject) => {
  inject('error', handleError);
};
