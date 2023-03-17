import set from '../../plugins/europeana/set.js';
import record from '../../plugins/europeana/record.js';

const PICK = ['title', 'id', 'description', 'items'];
const LOCALISE = ['title', 'description'];


let setApi;
let recordApi;
let context = {};

const recentlyPublishedSets = async(lang) => {
  const params = {
    query: 'visibility:published',
    profile: 'standard',
    pageSize: 4,
    qf: `lang:${lang}`
  };
  const response = await setApi.search(params, { withMinimalItemPreviews: true });
  return response.data.items || [];
};

const data = async(config = {}, localeCodes = []) => {
  context.$config = config;
  recordApi = record(context);
  context.$apis = { record: recordApi };
  setApi = set(context);
  const recentlyPublishedSetsPerLocale = {};
  for (const locale of localeCodes) {
    recentlyPublishedSetsPerLocale[locale] = await recentlyPublishedSets(locale);
  }

  return recentlyPublishedSetsPerLocale;
};

export {
  data,
  LOCALISE,
  PICK
};
