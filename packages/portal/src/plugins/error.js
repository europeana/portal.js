import createHttpError from 'http-errors';

const SCOPED_CODES = {
  RECORD_API: {
    404: 'itemNotFound'
  },
  SET_API: {
    401: 'galleryUnauthorised',
    403: 'galleryUnauthorised',
    423: 'setLocked'
  }
};
const GENERIC_CODES = {
  404: 'pageNotFound'
};

function normaliseErrorWithCode(errorOrCode, { scope } = {}) {
  let error;

  if (typeof errorOrCode === 'number') {
    errorOrCode = createHttpError(errorOrCode);
  }

  if (typeof errorOrCode === 'object') {
    error = errorOrCode;
    if (SCOPED_CODES[scope]?.[error.statusCode]) {
      error.code = SCOPED_CODES[scope][error.statusCode];
    } else if (GENERIC_CODES[error.statusCode]) {
      error.code = GENERIC_CODES[error.statusCode];
    }
  } else {
    error = new Error(this.$i18n.t(`errorMessage.${errorOrCode}.title`));
    error.code = errorOrCode;
  }

  return error;
}

// TODO: APM captureError?
export function handleError(errorOrCode, { scope } = {}) {
  const error = normaliseErrorWithCode.bind(this)(errorOrCode, { scope });

  if (this.$nuxt?.context?.res && error.statusCode) {
    this.$nuxt.context.res.statusCode = error.statusCode;
  }

  if (!error.code || this.$fetchState?.pending) {
    throw error;
  }

  // TODO: rename to s'thing more generic like 'handle-non-fetch-error'?
  this.$root.$emit('show-error-modal', error.code);
}

export default (ctx, inject) => {
  inject('error', handleError);
};
