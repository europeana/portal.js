import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';

import EmbedEuropeanaMap from '@/components/embed/EmbedEuropeanaMap.vue';

const localVue = createLocalVue();

const factory = (propsData = {}) => shallowMountNuxt(EmbedEuropeanaMap, {
  localVue,
  propsData,
  mocks: {
    $config: {
      app: {
        baseUrl: 'https://example.org'
      }
    },
    $t: (val) => val
  }
});

describe('components/embed/EmbedEuropeanaMap', () => {
  describe('head', () => {
    it('loads script for Vue 3', () => {
      const wrapper = factory();

      const script = wrapper.vm.head().script.find((s) => s.hid === 'vue3-script');

      expect(script.src.endsWith('/vue.global.prod.js')).toBe(true);
    });

    it('loads script for Europeana Map', () => {
      const wrapper = factory();

      const script = wrapper.vm.head().script.find((s) => s.hid === 'europeana-map-script');

      expect(script.src.endsWith('/europeana-map.iife.js')).toBe(true);
    });

    it('loads script for Vue 3 before script for Europeana Map', () => {
      const wrapper = factory();

      const vue3Index = wrapper.vm.head().script.findIndex((s) => s.hid === 'vue3-script');
      const europeanaMapIndex = wrapper.vm.head().script.findIndex((s) => s.hid === 'europeana-map-script');

      expect(vue3Index).toBeLessThan(europeanaMapIndex);
    });

    it('loads stylesheet for Europeana Map', () => {
      const wrapper = factory();

      const link = wrapper.vm.head().link.find((s) => s.hid === 'europeana-map-style');

      expect(link.href.endsWith('/europeana-map.css')).toBe(true);
    });
  });

  describe('template', () => {
    it('renders a map container', () => {
      const wrapper = factory();

      const mapContainer = wrapper.find('[data-qa="europeana map"]');

      expect(mapContainer.isVisible()).toBe(true);
    });
  });
});
