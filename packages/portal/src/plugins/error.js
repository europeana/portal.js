import createHttpError from 'http-errors';

const HTTP_CODES = {
  401: 'Unauthorised',
  403: 'Unauthorised',
  404: 'NotFound',
  410: 'Gone',
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

function normaliseErrorWithCode(errorOrStatusCode, { scope = 'generic' } = {}) {
  let error;

  if (typeof errorOrStatusCode === 'number') {
    errorOrStatusCode = createHttpError(errorOrStatusCode);
  }

  if (typeof errorOrStatusCode === 'object') {
    error = errorOrStatusCode;
    if (!error.code && HTTP_CODES[error.statusCode]) {
      const httpCode = HTTP_CODES[error.statusCode];
      error.code = `${scope}${httpCode}`;
    }
  }

  // Too much information re HTTP requests/responses to pass around to components:
  // dispose of it
  delete error.config;
  delete error.request;
  delete error.response;
  delete error.toJSON;

  return error;
}

function translateErrorWithCode(error, { tValues = {} }) {
  if (this.$i18n.te(`errorMessage.${error.code}`)) {
    const translations = this.$i18n.t(`errorMessage.${error.code}`);
    if (typeof translations === 'object') {
      error.i18n = {};
      for (const tKey in translations) {
        const tValuesForKey = tValues[tKey] || {};
        tValuesForKey.newline = '<br />';
        error.i18n[tKey] = this.$i18n.t(`errorMessage.${error.code}.${tKey}`, tValuesForKey);
      }
    }
  }

  return error;
}

export function handleError(errorOrStatusCode, options = {}) {
  let error = normaliseErrorWithCode(errorOrStatusCode, options);
  error = translateErrorWithCode.bind(this)(error, options);
  console.log('error code', error.code);
  error.isFetchError = this.$fetchState?.pending || false;

  if (this.$nuxt?.context?.res && error.statusCode) {
    this.$nuxt.context.res.statusCode = error.statusCode;
  }

  this.$store.commit('error/set', error);

  this.$nuxt?.context?.$apm?.captureError(error);

  if (error.isFetchError) {
    throw error;
  }
}

export default (ctx, inject) => {
  ctx.store.registerModule('error', storeModule);
  inject('error', handleError);
};
