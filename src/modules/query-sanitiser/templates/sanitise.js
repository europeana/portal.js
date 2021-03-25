const isPositiveInteger = (number) => {
  return Number.isInteger(number) && number > 0;
};

/**
 * Page to request, from an API endpoint (Europeana/Contentful/?)
 * If parameter is not present, returns default of page 1.
 * If parameter is present, and represents a positive integer, return it
 * typecast to Number.
 * Otherwise, parameter is invalid for page number, and return `null`.
 * @param {string} queryPage `page` query parameter from URL
 * @return {?number}
 */
export const page = (unsanitised) => {
  let sanitised = null;

  if (unsanitised === undefined || unsanitised === null) {
    sanitised = 1;
  } else {
    const pageAsNumber = Number(unsanitised);
    if (isPositiveInteger(pageAsNumber)) {
      sanitised = pageAsNumber;
    }
  }

  return sanitised;
};
