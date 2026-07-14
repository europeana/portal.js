import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import EntityOrganisationsMapPinPopover from '@/components/entity/organisations/EntityOrganisationsMapPinPopover.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const id = 'http://data.europeana.eu/organization/6';
const englishName = 'University Library';
const nativeName = 'Universiteitsbibliotheek';
const entity = {
  id,
  logo: { id: 'https://www.example.eu/logo.svg' },
  prefLabel: { nl: nativeName, en: englishName },
  hasAddress: { locality: 'Amsterdam', countryName: 'The Netherlands' }
};

const fetchEntityStub = sinon.stub().resolves(entity);
const factory = (propsData = {}) => shallowMountNuxt(EntityOrganisationsMapPinPopover, {
  localVue,
  propsData,
  mocks: {
    $apis: {
      entity: {
        get: fetchEntityStub
      }
    },
    $i18n: {
      locale: 'en'
    },
    $t: (val) => val
  }
});

describe('components/entity/organisations/EntityOrganisationsMapPinPopover', () => {
  describe('template', () => {
    it('shows a close button on small screens', async() => {
      const wrapper = factory({ id });
      await wrapper.vm.fetch();

      expect(wrapper.find('.d-sm-none.close-button').exists()).toBe(true);
    });
    it('shows the organisation name in native and English locale', async() => {
      const wrapper = factory({ id });
      await wrapper.vm.fetch();

      expect(wrapper.find('b-card-title-stub').text()).toBe(nativeName);
      expect(wrapper.find('b-card-sub-title-stub').text()).toBe(englishName);
    });

    it('shows a logo', async() => {
      const wrapper = factory({ id });
      await wrapper.vm.fetch();

      const logo = wrapper.find('.organisation-logo');
      const resizedLogo = wrapper.vm.resizedLogo;

      expect(logo.exists()).toBe(true);
      expect(logo.attributes('style')).toBe(`background-image: url(${resizedLogo});`);
    });

    it('shows the location', async() => {
      const wrapper = factory({ id });
      await wrapper.vm.fetch();

      expect(wrapper.find('.organisation-location').text()).toBe('Amsterdam, The Netherlands');
    });
  });
  describe('when id is changed', () => {
    it('fetches the entity', async() => {
      const wrapper = factory();
      await wrapper.setProps({ id });

      expect(fetchEntityStub.calledWith('organisation', '6')).toBe(true);
    });
  });
});
