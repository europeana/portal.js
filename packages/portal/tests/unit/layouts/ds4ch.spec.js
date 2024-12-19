import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../utils';
import BootstrapVue from 'bootstrap-vue';

import layout from '@/layouts/ds4ch';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (options = {}) => shallowMountNuxt(layout, {
  localVue,
  mocks: {
    $t: key => key,
    $route: {},
    $features: {},
    ...options.mocks
  },
  stubs: ['nuxt']
});

describe('layouts/ds4ch.vue', () => {
  it('renders the ds4ch header', () => {
    const wrapper = factory();

    const header = wrapper.find('ds4chpageheader-stub');

    expect(header.isVisible()).toBe(true);
  });

  it('renders the ds4ch footer', () => {
    const wrapper = factory();

    const footer = wrapper.find('ds4chpagefooter-stub');

    expect(footer.isVisible()).toBe(true);
  });
});
