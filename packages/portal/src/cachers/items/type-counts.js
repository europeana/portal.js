const LOCALISE = false;
const PICK = false;

import { EuropeanaRecordApi } from '@europeana/apis';

let europeanaRecordApi;

const facetsForMediaTypes = async() => {
  const query = '*:*';
  const params = {
    profile: 'facets',
    query,
    facet: 'TYPE',
    qf: 'contentTier:(1 OR 2 OR 3 OR 4)',
    rows: 0
  };
  const response = await europeanaRecordApi.search(params);
  return response.facets?.[0]?.fields || [];
};

const data = () => {
  europeanaRecordApi = new EuropeanaRecordApi;

  return facetsForMediaTypes();
};

export {
  data,
  LOCALISE,
  PICK
};
