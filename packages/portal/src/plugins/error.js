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

    if (error.isAxiosError) {
      const errorResponseStatus = error.response?.status;

      // Too much information re HTTP requests/responses to pass around to components:
      // dispose of it
      delete error.config;
      delete error.request;
      delete error.response;
      delete error.toJSON;

      if (errorResponseStatus) {
        error = createHttpError(errorResponseStatus, {
          cause: error
        });
      } else if (error.message === 'Network Error') {
        error.name = 'NetworkError';
      }
    }

    if (!error.code && HTTP_CODES[error.statusCode]) {
      const httpCode = HTTP_CODES[error.statusCode];
      error.code = `${scope}${httpCode}`;
    }
  }

  return error;
}

function translateErrorWithCode(error, { tValues = {} }) {
  const codeToUse = error.cause?.code ? error.cause.code : error.code;
  if (this.$i18n.te(`errorMessage.${codeToUse}`)) {
    const translations = this.$i18n.t(`errorMessage.${codeToUse}`);
    if (typeof translations === 'object') {
      error.i18n = {};
      for (const tKey in translations) {
        const tValuesForKey = tValues[tKey] || {};
        tValuesForKey.newline = '<br />';
        error.i18n[tKey] = this.$i18n.t(`errorMessage.${codeToUse}.${tKey}`, tValuesForKey);
      }
    }
  }

  return error;
}

export function handleError(errorOrStatusCode, options = {}) {
  let error = normaliseErrorWithCode(errorOrStatusCode, options);
  error = translateErrorWithCode.bind(this)(error, options);

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
