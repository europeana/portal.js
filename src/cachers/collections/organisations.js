import baseData from './index.js';
import organizationsMixin from '../../mixins/europeana/entities/organizations.js';

const PICK = ['slug', 'prefLabel'];
const INTERNATIONALISE = (entities) => entities.map((entity) => ({
  ...entity,
  prefLabel: organizationsMixin.methods.organizationEntityNativeName(entity)
}));
const SORT = (entity) => Object.values(entity.prefLabel)[0];

const data = (config = {}) => baseData({ type: 'organization' }, config);

export {
  data,
  INTERNATIONALISE,
  SORT,
  PICK
};
