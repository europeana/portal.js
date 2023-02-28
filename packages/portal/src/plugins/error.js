import createHttpError from 'http-errors';
import kebabCase from 'lodash/kebabCase';

export const CODES = {
  RECORD_API: {
    404: 'itemNotFound'
  },
  SET_API: {
    401: 'galleryUnauthorised',
    403: 'galleryUnauthorised',
    423: 'setLocked'
  }
};

// TODO: APM captureError?
export function handleError(errorOrCode, { scope } = {}) {
  let code;
  let error;

  if (typeof errorOrCode === 'number') {
    errorOrCode = createHttpError(errorOrCode);
  }

  if (typeof errorOrCode === 'object') {
    error = errorOrCode;

    if (this.$fetchState.pending && error.statusCode) {
      this.$nuxt.context.res.statusCode = error.statusCode;
    }

    if (CODES[scope]?.[error.statusCode]) {
      code = CODES[scope][error.statusCode];
    } else {
      throw error;
    }
  } else {
    code = errorOrCode;
    error = new Error(this.$i18n.t(`errorMessage.${code}.title`));
  }

  if (this.$fetchState.pending) {
    const kebabCaseCode = kebabCase(code);

    // TODO: delegate these derivations to ErrorMessage.vue? just set `code` property on `error` here?
    error.titlePath = `errorMessage.${code}.title`;
    error.descriptionPath = `errorMessage.${code}.description`;
    error.pageTitlePath = `errorMessage.${code}.metaTitle`;
    try {
      error.illustrationSrc = require(`@/assets/img/illustrations/il-${kebabCaseCode}.svg`);
    } catch (e) {
      // don't fall apart just because an image is missing...
    }

    throw error;
  } else {
    // TODO: rename to s'thing more generic like 'handle-non-fetch-error'?
    this.$root.$emit('show-error-modal', code);
  }
}

export default (ctx, inject) => {
  inject('error', handleError);
};
