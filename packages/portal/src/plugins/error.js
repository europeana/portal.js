import kebabCase from 'lodash/kebabCase.js';

export const CODES = {
  APIS: {
    SET: {
      401: 'galleryUnauthorised',
      403: 'galleryUnauthorised',
      423: 'setLocked'
    }
  }
};

function handleError(error, { scope, fetch = false } = {}) {
  if (fetch && process.server) {
    this.$nuxt.context.res.statusCode = error.statusCode || 500;
  }

  if (!scope[error.statusCode]) {
    throw error;
  }

  const code = scope[error.statusCode];

  if (fetch) {
    error.titlePath = `errorMessage.${code}.title`;
    error.descriptionPath = `errorMessage.${code}.description`;
    error.pageTitlePath = `errorMessage.${code}.metaTitle`;
    error.illustrationSrc = require(`@/assets/img/illustrations/il-${kebabCase(code)}.svg`);

    throw error;
  } else {
    this.$root.$emit('show-error-modal', code);
  }
}

export default (ctx, inject) => {
  inject('error', handleError);
  inject('errorCodes', CODES);
};
