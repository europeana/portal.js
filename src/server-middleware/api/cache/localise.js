import { langMapValueForLocale } from '../../../plugins/europeana/utils.js';

export default (items, locale) => {
  if (!Array.isArray(items)) {
    return items;
  }

  return items.map(item => ({
    ...item,
    prefLabel: langMapValueForLocale(item.prefLabel, locale).values[0]
  }))
    .filter(item => item.prefLabel);
};
