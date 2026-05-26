import baseData from './index.js';
import {
  organizationEntityNativeName,
  organizationEntityNonNativeEnglishName
} from '../../utils/europeana/entities/organizations.js';

const PICK = ['id', 'slug', 'recordCount', 'prefLabel', 'altLabel', 'countryPrefLabel'];
const LOCALISE = 'countryPrefLabel';

export const organisationData = (organisation) => ({
  ...organisation,
  // Keep isAggregatedBy.recordCount as recordCount
  // TODO: add to other entity-type cachers too
  recordCount: organisation.isAggregatedBy?.recordCount || 0,
  countryPrefLabel: organisation.country?.prefLabel,
  // Store as prefLabel the native name, as altLabel the English name (if non-native)
  altLabel: organizationEntityNonNativeEnglishName(organisation),
  prefLabel: organizationEntityNativeName(organisation)
});

const data = async(config = {}) => {
  // TODO: exclude aggregators? or do it in the consumer?
  const entityData = await baseData({ type: 'organization' }, config);

  return entityData.map(organisationData);
};

export {
  data,
  LOCALISE,
  PICK
};
