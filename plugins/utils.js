/**
 * Page to request, from an API endpoint (Europeana/Contentful/?)
 * If parameter is not present, returns default of page 1.
 * If parameter is present, and represents a positive integer, return it
 * typecast to Number.
 * Otherwise, parameter is invalid for page number, and return `null`.
 * @param {string} queryPage `page` query parameter from URL
 * @return {?number}
 */
export function pageFromQuery(queryPage) {
  if (queryPage) {
    if (/^[1-9]\d*$/.test(queryPage)) {
      return Number(queryPage);
    } else {
      return null;
    }
  } else {
    return 1;
  }
}
