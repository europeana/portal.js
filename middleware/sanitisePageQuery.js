// Redirects non-positive integer values for `page` to `page=1`

/**
 * Page to request, from an API endpoint (Europeana/Contentful/?)
 * If parameter is not present, returns default of page 1.
 * If parameter is present, and represents a positive integer, return it
 * typecast to Number.
 * Otherwise, parameter is invalid for page number, and return `null`.
 * @param {string} queryPage `page` query parameter from URL
 * @return {?number}
 */
export const pageFromQuery = (queryPage) => {
  let page = null;

  if (queryPage === undefined || queryPage === null) {
    page = 1;
  } else {
    const pageAsNumber = Number(queryPage);
    if (Number.isInteger(pageAsNumber) && pageAsNumber > 0) page = pageAsNumber;
  }

  console.log('********\n\npage\n\n********', page);
  return page;
};

export default ({ app, route, query, redirect }) => {
  const currentPage = pageFromQuery(query.page);
  if (currentPage === null) {
    return redirect(app.$path({ ...route, query: { ...query, page: 1 } }));
  } else {
    app.$page = currentPage;
  }
};
