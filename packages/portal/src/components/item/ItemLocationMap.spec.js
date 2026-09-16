import { createLocalVue, shallowMount } from '@vue/test-utils';

import ItemLocationMap from './ItemLocationMap.vue';

const localVue = createLocalVue();

const factory = () => shallowMount(ItemLocationMap, {
  localVue,
  propsData: {
    location: {
      prefLabel: {
        en: ['Brighton']
      },
      latitude: 50.82838,
      longitude: -0.13947
    }
  },
  mocks: {
    $t: (key) => key,
    $i18n: {
      locale: 'en'
    }
  },
  stubs: {
    EmbedEuropeanaMap: {
      template: `
        <div id="europeana-map">
          <label v-if="$slots.label">
            <slot name="label" />
          </label>
        </div>
      `
    }
  }
});

describe('@/components/item/ItemLocationMap', () => {
  it('renders the EmbedEuropeanaMap', () => {
    const wrapper = factory();

    const map =  wrapper.find('#europeana-map');

    expect(map.exists()).toBe(true);
  });

  describe('label', () => {
    it('starts with localised prefLabel', () => {
      const wrapper = factory();

      const labelText =  wrapper.find('label').text();

      expect(labelText.startsWith('Brighton')).toBe(true);
    });

    it('ends with formatted co-ordinates', () => {
      const wrapper = factory();

      const labelText =  wrapper.find('label').text();

      expect(labelText.endsWith('50.82838° N -0.13947° W')).toBe(true);
    });
  });

  describe('.json', () => {
    it('uses the latitude and longitude', () => {
      const wrapper = factory();

      const json = wrapper.vm.json;
      const geo = JSON.parse(json);

      expect(geo).toEqual({
        'type': 'FeatureCollection',
        'features': [
          {
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': [
                -0.13947,
                50.82838
              ]
            }
          }
        ]
      });
    });
  });
});
