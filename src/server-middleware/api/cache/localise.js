import { langMapValueForLocale } from '../../../plugins/europeana/utils.js';

export default (items, locale) => {
  return items.map(item => ({
    ...item,
    prefLabel: langMapValueForLocale(item.prefLabel, locale).values[0]
  }))
    .filter(item => item.prefLabel);
};
