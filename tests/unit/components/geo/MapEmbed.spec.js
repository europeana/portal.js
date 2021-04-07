import { createLocalVue, shallowMount } from '@vue/test-utils';

import MapEmbed from '../../../../src/components/geo/MapEmbed';

const localVue = createLocalVue();

const factory = () => shallowMount(MapEmbed, {
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

describe('components/geo/MapEmbed', () => {
  it('renders an iframe', () => {
    const wrapper = factory();

    const iframe =  wrapper.find('iframe');

    iframe.exists().should.be.true;
  });

  describe('label', () => {
    it('starts with localised prefLabel', () => {
      const wrapper = factory();

      const labelText =  wrapper.find('label').text();

      labelText.should.startWith('Brighton');
    });

    it('ends with formatted co-ordinates', () => {
      const wrapper = factory();

      const labelText =  wrapper.find('label').text();

      labelText.should.endWith('50.82838° N -0.13947° W');
    });
  });

  describe('.marker', () => {
    it('uses the latitude and longitude props', () => {
      const wrapper = factory();

      const marker = wrapper.vm.marker;

      marker.should.eq('50.82838,-0.13947');
    });
  });

  describe('.bbox', () => {
    it('extends latitude by 5 degrees and longitude by 10 degrees', () => {
      const wrapper = factory();

      const bbox = wrapper.vm.bbox;

      bbox.should.eq('-10.13947,45.82838,9.86053,55.82838');
    });
  });

  describe('.iframeSrc', () => {
    it('uses OpenStreetMap', () => {
      const wrapper = factory();

      const iframeSrc = wrapper.vm.iframeSrc;

      iframeSrc.should.eq('https://www.openstreetmap.org/export/embed.html?marker=50.82838,-0.13947&bbox=-10.13947,45.82838,9.86053,55.82838&layer=mapnik');
    });
  });
});
