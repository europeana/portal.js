const LOCALISE = false;
const PICK = false;

import EuropeanaRecordApi from '../../plugins/europeana/record.js';

const data = (context = {}) => {
  const api = context.$apis?.record || new EuropeanaRecordApi(context);

  const facetsForMediaTypes = async() => {
    const query = '*:*';
    const params = {
      profile: 'facets',
      query,
      facet: 'TYPE',
      qf: 'contentTier:(1 OR 2 OR 3 OR 4)',
      rows: 0
    };
    const response = await api.search(params);
    return response.facets?.[0]?.fields || [];
  };

  return facetsForMediaTypes();
};

export {
  data,
  LOCALISE,
  PICK
};
