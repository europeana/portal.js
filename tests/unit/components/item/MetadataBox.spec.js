import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import MetadataBox from '../../../../components/item/MetadataBox';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData) => shallowMount(MetadataBox, {
  localVue,
  propsData,
  // stubs: ['b-tab'],
  mocks: {
    $t: (key) => key
  }
});

const fixtures = {
  locations: {
    eastSussex: { prefLabel: 'East Sussex' },
    brighton: { prefLabel: 'Brighton', latitude: 50.82838, longitude: -0.13947 }
  }
};

describe('components/item/MetadataBox', () => {
  describe('location tab', () => {
    context('when location prop is present', () => {
      const location = {
        def: [
          fixtures.locations.eastSussex,
          fixtures.locations.brighton
        ]
      };

      it('is rendered', () => {
        const wrapper = factory({
          location
        });

        const locationTab = wrapper.find('[data-qa="location tab"]');

        locationTab.exists().should.be.true;
      });

      context('and mappable location is present', () => {
        it('does not render map embed at first', () => {
          const wrapper = factory({
            location
          });

          const mapEmbed = wrapper.find('[data-qa="map embed"]');

          mapEmbed.exists().should.be.false;
        });

        it('renders map when location tab is clicked', async() => {
          const wrapper = factory({
            location
          });

          const locationTab = wrapper.find('[data-qa="location tab"]');
          locationTab.vm.$emit('click');
          await wrapper.vm.$nextTick();
          const mapEmbed = wrapper.find('[data-qa="map embed"]');

          mapEmbed.exists().should.be.true;
        });
      });
    });

    context('when location prop is absent', () => {
      it('is not rendered', () => {
        const wrapper = factory({
          location: null
        });

        const locationTab = wrapper.find('[data-qa="location tab"]');

        locationTab.exists().should.be.false;
      });
    });
  });

  describe('.mappableLocation', () => {
    it('uses the first location object having latitude and longitude', () => {
      const wrapper = factory({
        location: {
          def: [
            fixtures.locations.eastSussex,
            fixtures.locations.brighton
          ]
        }
      });

      const mappableLocation = wrapper.vm.mappableLocation;

      mappableLocation.should.eql(fixtures.locations.brighton);
    });

    it('is `null` if no such location', () => {
      const wrapper = factory({
        location: {
          def: [
            fixtures.locations.eastSussex
          ]
        }
      });

      const mappableLocation = wrapper.vm.mappableLocation;

      (mappableLocation === null).should.be.true;
    });
  });
});
