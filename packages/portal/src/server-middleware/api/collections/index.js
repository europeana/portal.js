import { cached } from '../cache/index.js';

export const fetchData = async(type, reqQuery, config = {}) => {
  const lang = reqQuery.lang;
  const query = reqQuery.query;
  const pageSize = Number(reqQuery.pageSize) || 10;
  const page = Number(reqQuery.page) || 1;
  const sort = reqQuery.sort || 'prefLabel asc';
  const sortParts = sort.split(' ');
  const sortField = sortParts[0] || 'prefLabel';
  const sortDir = sortParts[1] || 'asc';

  const key = `${lang}:collections:${type}`;
  const data = await cached(key, config);

  let items = Array.from(data[key] || []);

  // filter
  if (query) {
    const queryRegExp = new RegExp(query, 'i');
    // TODO: look to abbreviation too (for orgs); store in cache 1st
    items = items.filter((item) => {
      let candidates = typeof item.prefLabel === 'string' ? [item.prefLabel] : Object.values(item.prefLabel);
      if (item.altLabel) {
        candidates = candidates.concat(typeof item.altLabel === 'string' ? [item.altLabel] : Object.values(item.altLabel));
      }

      return candidates.some((label) => queryRegExp.test(label));
    });
  }

  const total = items.length;

  // sort
  items = items.sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if ((typeof aValue === 'number') && (typeof bValue === 'number')) {
      return sortDir === 'asc' ? a.recordCount - b.recordCount : b.recordCount - a.recordCount;
    } else if ((typeof aValue === 'string') && (typeof bValue === 'string')) {
      return sortDir === 'asc' ? aValue.localeCompare(bValue) : -aValue.localeCompare(bValue);
    } else {
      // don't know how to sort types other than number or string; return 0 i.e. no sorting
      // TODO: handle langmaps? only if one key?
      return 0;
    }
  });

  // paginate
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  items = items.slice(startIndex, endIndex);

  // TODO: tailor return? e.g. localise

  return { items, total };
};

export default (config = {}) => async(req, res, next) => {
  try {
    const { items, total } = await fetchData(req.params.type, req.query, config);

    res.json({ items, total });
  } catch (e) {
    next(e);
  }
};
