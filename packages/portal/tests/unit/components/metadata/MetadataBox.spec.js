import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import MetadataBox from '@/components/metadata/MetadataBox';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData) => shallowMount(MetadataBox, {
  localVue,
  propsData,
  mocks: {
    $t: (key) => key,
    $i18n: {
      locale: 'en'
    }
  },
  stubs: ['MapEmbed']
});

const fixtures = {
  locations: {
    eastSussex: { prefLabel: 'East Sussex' },
    brighton: { prefLabel: 'Brighton', latitude: 50.82838, longitude: -0.13947 }
  }
};

describe('components/metadata/MetadataBox', () => {
  describe('location tab', () => {
    describe('when location prop is present', () => {
      const location = {
        def: [
          fixtures.locations.eastSussex,
          fixtures.locations.brighton
        ]
      };

      it('is rendered', () => {
        const wrapper = factory({
          metadata: {},
          location
        });

        const locationTab = wrapper.find('[data-qa="location tab"]');

        expect(locationTab.exists()).toBe(true);
      });

      describe('and mappable location is present', () => {
        it('does not render map embed at first', () => {
          const wrapper = factory({
            metadata: {},
            location
          });

          expect(wrapper.vm.showLocationMap).toBe(false);
        });

        it('renders map when location tab is clicked', async() => {
          const wrapper = factory({
            metadata: {},
            location
          });

          wrapper.vm.clickLocationTab();

          expect(wrapper.vm.showLocationMap).toBe(true);
        });
      });
    });

    describe('when location prop is absent', () => {
      it('is not rendered', () => {
        const wrapper = factory({
          metadata: {},
          location: null
        });

        const locationTab = wrapper.find('[data-qa="location tab"]');

        expect(locationTab.exists()).toBe(false);
      });
    });
  });

  describe('.mappableLocation', () => {
    it('uses the first location object having latitude and longitude', () => {
      const wrapper = factory({
        metadata: {},
        location: {
          def: [
            fixtures.locations.eastSussex,
            fixtures.locations.brighton
          ]
        }
      });

      const mappableLocation = wrapper.vm.mappableLocation;

      expect(mappableLocation).toEqual(fixtures.locations.brighton);
    });

    it('is `null` if no such location', () => {
      const wrapper = factory({
        metadata: {},
        location: {
          def: [
            fixtures.locations.eastSussex
          ]
        }
      });

      const mappableLocation = wrapper.vm.mappableLocation;

      expect(mappableLocation === null).toBe(true);
    });
  });
});
