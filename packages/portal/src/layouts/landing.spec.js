import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';
import BootstrapVue from 'bootstrap-vue';

import layout from '@/layouts/landing';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (options = {}) => shallowMountNuxt(layout, {
  localVue,
  mocks: {
    $config: { app: { baseUrl: 'https://www.example.org', siteName: 'Europeana' } },
    $i18n: { locale: 'en' },
    $t: key => key,
    $route: { path: '/landing', fullPath: '/landing' },
    $features: {},
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
  });
});
