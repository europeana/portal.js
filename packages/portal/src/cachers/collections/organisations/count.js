import EuropeanaEntityApi from '../../../plugins/europeana/entity.js';

const LOCALISE = false;
const PICK = false;

const data = (context = {}) => {
  const api = context.$apis?.entity || new EuropeanaEntityApi(context);

  const countEntities = async(params = {}) => {
    const response = await api.search({
      query: '*:*',
      scope: 'europeana',
      pageSize: 0,
      ...params
    });
    return response.partOf?.total;
  };

  return countEntities({ type: 'organization' });
};

export {
  data,
  LOCALISE,
  PICK
};
