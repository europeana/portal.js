import { createLocalVue, shallowMount } from '@vue/test-utils';

import EmbedMap from '@/components/embed/EmbedMap';

const localVue = createLocalVue();

const factory = () => shallowMount(EmbedMap, {
  localVue,
  propsData: {
    prefLabel: {
      en: ['Brighton']
    },
    latitude: 50.82838,
    longitude: -0.13947
  },
  mocks: {
    $t: (key) => key,
    $i18n: {
      locale: 'en'
    }
  }
});

describe('components/embed/EmbedMap', () => {
  it('renders an iframe', () => {
    const wrapper = factory();

    const iframe =  wrapper.find('iframe');

    expect(iframe.exists()).toBe(true);
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

  describe('.marker', () => {
    it('uses the latitude and longitude props', () => {
      const wrapper = factory();

      const marker = wrapper.vm.marker;

      expect(marker).toBe('50.82838,-0.13947');
    });
  });

  describe('.bbox', () => {
    it('extends latitude by 5 degrees and longitude by 10 degrees', () => {
      const wrapper = factory();

      const bbox = wrapper.vm.bbox;

      expect(bbox).toBe('-10.13947,45.82838,9.86053,55.82838');
    });
  });

  describe('.iframeSrc', () => {
    it('uses OpenStreetMap', () => {
      const wrapper = factory();

      const iframeSrc = wrapper.vm.iframeSrc;

      expect(iframeSrc).toBe('https://www.openstreetmap.org/export/embed.html?marker=50.82838,-0.13947&bbox=-10.13947,45.82838,9.86053,55.82838&layer=mapnik');
    });
  });
});
