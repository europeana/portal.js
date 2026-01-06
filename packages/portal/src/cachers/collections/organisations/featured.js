import baseData from '../index.js';
import organizationsMixin from '../../../mixins/europeana/entities/organizations.js';

const PICK = ['id', 'prefLabel', 'logo'];
const DAILY = 4;
const INTERNATIONALISE = (entities) => entities.map((entity) => ({
  ...entity,
  prefLabel: organizationsMixin.methods.organizationEntityNativeName(entity)
})).filter((entity) => !!entity.prefLabel);
const SORT = (entity) => {
  if (!entity.prefLabel) {
    console.warn(`no prefLabel: ${JSON.stringify(entity, null, 2)}`);
  }
  return Object.values(entity.prefLabel)[0];
};

const data = (config = {}) => baseData({ type: 'organization' }, config);

export {
  data,
  PICK,
  DAILY,
  INTERNATIONALISE,
  SORT
};
