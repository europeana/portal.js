import baseData from '../index.js';
import EuropeanaEntityApi from '../../../plugins/europeana/entity.js';

const PICK = ['id', 'slug', 'recordCount', 'prefLabel', 'geographicScope', 'countryPrefLabel', 'heritageDomain', 'logo'];
const LOCALISE = 'countryPrefLabel';

const data = async(context = {}) => {
  const api = context.$apis?.entity || new EuropeanaEntityApi(context);
  const organisationData = await baseData({ type: 'aggregator' }, context);

  return await Promise.all(organisationData.map(
    async(organisation) => {
      // Add heritageDomain or countryPrefLabel depending on geographicScope
      const entityId = organisation.id.split('/').pop();
      const fullEntityResponse = await api.get('organisation', entityId);

      if (fullEntityResponse?.geographicScope === 'International') {
        organisation.heritageDomain = fullEntityResponse?.heritageDomain;
      } else {
        organisation.countryPrefLabel = organisation.country.prefLabel;
      }

      organisation.geographicScope = fullEntityResponse?.geographicScope;
      organisation.recordCount = organisation.isAggregatedBy.recordCount;

      return organisation;
    }));
};

export {
  data,
  LOCALISE,
  PICK
};
