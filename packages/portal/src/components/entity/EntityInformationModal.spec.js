import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import EntityInformationModal from '@/components/entity/EntityInformationModal.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData = {}) => mount(EntityInformationModal, {
  localVue,
  propsData,
  mocks: {
    $i18n: { locale: 'en' },
    $n: (val) => val,
    $t: (val) => val,
    $features: {},
    localePath: (val) => val
  },
  stubs: ['EntityBadges']
});

const id = 'http://data.europeana.eu/organization/190';
const englishName = { values: ['Library of Europe'], code: 'en' };
const homepage = 'https://www.deutsche-digitale-bibliothek.de';
const country = 'Germany';
const city = 'Frankfurt am Main';
const acronym = { en: 'ABC' };
const heritageDomain = 'Scientific heritage';
const providesSupportForMediaType = ['Image', 'Video'];
const geographicScope = 'International';
const providesSupportForDataActivity = ['Copyright support', 'Content storage'];
const providesCapacityBuildingActivity = ['One-to-one support', 'Webinars / workshops'];
const providesAudienceEngagementActivity = ['Social media engagement', 'Digital curation'];
const isAggregatedBy = { recordCount: 20000 };
const aggregatesFrom = ['http://data.europeana.eu/organization/100', 'http://data.europeana.eu/organization/101'];

const expectedInfo = [
  { label: 'website', value: homepage },
  { label: 'organisation.country', value: country },
  { label: 'organisation.nameAcronym', value: Object.values(acronym)[0], lang: Object.keys(acronym)[0] },
  { label: 'organisation.city', value: city },
  { label: 'organisation.heritageDomain', value: heritageDomain },
  { label: 'organisation.providesSupportForMediaType', value: providesSupportForMediaType.join('; ') },
  { label: 'organisation.geographicScope', value: geographicScope },
  { label: 'organisation.providesSupportForDataActivity', value: providesSupportForDataActivity.join('; ') },
  { label: 'organisation.providesCapacityBuildingActivity', value: providesCapacityBuildingActivity.join('; ') },
  { label: 'organisation.providesAudienceEngagementActivity', value: providesAudienceEngagementActivity.join('; ') },
  { label: 'organisation.recordCount', value: isAggregatedBy.recordCount.toString() },
  { label: 'organisation.providingInstitutionsCount', value: aggregatesFrom.length.toString() }

];

const entity = {
  id,
  homepage,
  hasAddress: {
    countryName: country,
    locality: city
  },
  acronym,
  heritageDomain,
  providesSupportForMediaType,
  geographicScope,
  providesSupportForDataActivity,
  providesCapacityBuildingActivity,
  providesAudienceEngagementActivity,
  isAggregatedBy,
  aggregatesFrom
};

const entityProps = {
  modalStatic: true,
  title: englishName,
  entity,
  englishName
};

describe('components/entity/EntityInformationModal', () => {
  it('shows a title', () => {
    const wrapper = factory(entityProps);

    expect(wrapper.find('h5.modal-title').text()).toBe(englishName.values[0]);
  });

  it('shows each info field with the corresponding label', () => {
    const wrapper = factory(entityProps);
    Object.keys(expectedInfo).forEach((key) => {
      const infoField = wrapper.find(`ul li[data-qa="${expectedInfo[key].label} field"]`);
      expect(infoField.text()).toContain(expectedInfo[key].label);
      expect(infoField.text()).toContain(expectedInfo[key].value);
    });
  });

  it('links to the organisation URL for the website', () => {
    const wrapper = factory(entityProps);

    const websiteLink = wrapper.find('ul li[data-qa="website field"] a');
    expect(websiteLink.attributes().href).toEqual(homepage);
  });

  describe('when entity aggregates from', () => {
    it('shows 4 entity badges and a view all link', () => {
      const wrapper = factory(entityProps);

      const viewAllLink = wrapper.find('.view-all-button');
      expect(wrapper.find('entitybadges-stub').exists()).toBe(true);
      expect(viewAllLink.text()).toEqual('actions.viewAll');
      expect(viewAllLink.attributes().href).toEqual('/collections/organisations?tab=aggregators&show=190');
    });
  });
});
