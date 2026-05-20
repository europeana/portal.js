import { cached } from '../cache/index.js';

import { organizationEntityNativeName } from '../../../utils/europeana/entities/organizations.js';

export const fetchCollections = async(type, reqQuery, config) => {
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

  let items = data[key] || [];

  // filter
  if (query) {
    const queryRegExp = new RegExp(query, 'i');
    // TODO: look to altLabel and abbreviation too (if present); store in cache 1st
    items = items.filter((i) => Object.values(i.prefLabel).some((label) => queryRegExp.test(label)));
  }

  const total = items.length;

  // TODO: sort
  items = items.sort((a, b) => {
    if (sortField === 'prefLabel') {
      if (type === 'organisations') {
        const aName = Object.values(organizationEntityNativeName(a))[0];
        const bName = Object.values(organizationEntityNativeName(b))[0];
        return sortDir === 'asc' ? aName.localeCompare(bName) : -aName.localeCompare(bName);
      } else {
        // TODO: localise prefLabel for lang, then sort by it
      }
    } else if (sortField === 'recordCount') {
      return sortDir === 'asc' ? a.recordCount - b.recordCount : b.recordCount - a.recordCount;
    }
    // TODO: country
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
    const { items, total } = await fetchCollections(req.params.type, req.query, config);

    res.set('Content-Type', 'application/json');
    res.send({ items, total });
  } catch (e) {
    next(e);
  }
};
