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
    ...options.mocks
  },
  stubs: ['nuxt']
});

describe('layouts/ds4ch.vue', () => {
  describe('head', () => {
    describe('title', () => {
      it('uses site name', () => {
        const wrapper = factory();

        expect(wrapper.vm.head().title).toBe('ds4ch.title');
      });
    });
  });
});
