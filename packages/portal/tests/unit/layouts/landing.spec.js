import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../utils';
import BootstrapVue from 'bootstrap-vue';

import layout from '@/layouts/landing';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (options = {}) => shallowMountNuxt(layout, {
  localVue,
  mocks: {
    $config: { app: { baseUrl: 'https://www.example.org', siteName: 'Europeana' } },
    $t: key => key,
    $route: { fullPath: '/landing' },
    ...options.mocks
  },
  stubs: ['nuxt']
});

describe('layouts/landing.vue', () => {
  it('renders the landing header', () => {
    const wrapper = factory();

    const header = wrapper.find('landingpageheader-stub');

    expect(header.isVisible()).toBe(true);
  });

  it('renders the landing footer', () => {
    const wrapper = factory();

    const footer = wrapper.find('landingpagefooter-stub');

    expect(footer.isVisible()).toBe(true);
  });

  describe('head', () => {
    describe('link', () => {
      it('includes favicon', () => {
        const wrapper = factory();

        const iconLink = wrapper.vm.head().link.find(anylink => anylink.rel = 'icon');

        expect(iconLink.type).toEqual('image/x-icon');
      });
    });

    describe('meta', () => {
      it('includes og:url with canonical URL', () => {
        const wrapper = factory();

        const headMeta = wrapper.vm.head().meta;

        expect(headMeta.find((tag) => tag.property === 'og:url').content).toBe('https://www.example.org/landing');
      });
    });
  });
});
