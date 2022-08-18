import baseData from './index.js';
import organizationsMixin from '../../mixins/europeana/entities/organizations.js';
import { langMapValueForLocale } from '../../plugins/europeana/utils.js';

const PICK = ['slug', 'nativeLabel', 'nonNativeEnglishLabel'];
const INTERNATIONALISE = (entities) => entities.map((entity) => ({
  ...entity,
  nativeLabel: langMapValueForLocale(organizationsMixin.methods.organizationEntityNativeName(entity)),
  nonNativeEnglishLabel: langMapValueForLocale(organizationsMixin.methods.organizationEntityNonNativeEnglishName(entity))
}));

const data = (config = {}) => baseData({ type: 'organization' }, config);

export {
  data,
  INTERNATIONALISE,
  PICK
};
