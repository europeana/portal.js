import createHttpError from 'http-errors';

const HTTP_CODES = {
  401: 'Unauthorised',
  403: 'Unauthorised',
  404: 'NotFound',
  423: 'Locked'
};

const storeModule = {
  namespaced: true,

  state: () => ({
    error: null
  }),

  mutations: {
    set(state, error) {
      state.error = error;
    }
  }
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

  const translations = this.$i18n.t(`errorMessage.${error.code}`) || {};
  if (typeof translations === 'object') {
    for (const tKey in translations) {
      const tValuesForKey = tValues[tKey] || {};
      tValuesForKey.newline = '<br />';
      error[tKey] = this.$i18n.t(`errorMessage.${error.code}.${tKey}`, tValuesForKey);
    }
  }

  if ((error.message === '') && error.title) {
    error.message = error.title;
  }

  return error;
}

// TODO: APM captureError?
export function handleError(errorOrCode, options = {}) {
  let error = normaliseErrorWithCode(errorOrCode, options);
  error = translateErrorWithCode.bind(this)(error, options);
  error.isFetchError = this.$fetchState?.pending || false;

  if (this.$nuxt?.context?.res && error.statusCode) {
    this.$nuxt.context.res.statusCode = error.statusCode;
  }

  this.$store.commit('error/set', error);

  if (error.isFetchError) {
    throw error;
  }
}

export default (ctx, inject) => {
  ctx.store.registerModule('error', storeModule);
  inject('error', handleError);
};
