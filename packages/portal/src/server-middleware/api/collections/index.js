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
    // case-insensitive matching
    const lowerCaseQuery = query.toLowerCase();

    const candidatesFrom = (fieldValue) => {
      let candidates = [];

      if (fieldValue) {
        if (typeof fieldValue === 'string') {
          candidates.push(fieldValue.toLowerCase());
        } else if (typeof fieldValue === 'object') {
          candidates = candidates.concat(Object.values(fieldValue).map((val) => val.toLowerCase()));
        }
      }

      return candidates;
    };

    // TODO: look to abbreviation too (for orgs); store in cache 1st
    items = items.filter((item) => {
      return candidatesFrom(item.prefLabel)
        .concat(candidatesFrom(item.altLabel))
        .some((label) => label.includes(lowerCaseQuery));
    });
  }

  const total = items.length;

  // sort
  // TODO: optimise, because the bothValuesAre tests are run many times; derive from 1st two values,
  //       assuming consistency of field value type across all items?
  items = items.sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    const bothValuesAre = (testFn) => testFn(aValue) && testFn(bValue);

    // handle single-key lang maps, by picking the sole value and sorting on that
    if (bothValuesAre((value) => typeof value === 'object' && Object.keys(value).length === 1)) {
      aValue = Object.values(aValue)[0];
      bValue = Object.values(bValue)[0];
    }

    if (bothValuesAre((value) => typeof value === 'number')) {
      return sortDir === 'asc' ? a.recordCount - b.recordCount : b.recordCount - a.recordCount;
    } else if (bothValuesAre((value) => typeof value === 'string')) {
      return sortDir === 'asc' ? aValue.localeCompare(bValue) : -aValue.localeCompare(bValue);
    } else {
      // don't know how to sort types other than number or string; return 0, i.e. unsorted
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
