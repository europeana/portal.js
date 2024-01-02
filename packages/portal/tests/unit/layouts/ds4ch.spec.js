import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import layout from '@/layouts/ds4ch';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (options = {}) => shallowMountNuxt(layout, {
  localVue,
  mocks: {
    $t: key => key,
    $route: {},
    ...options.mocks
  }
});

describe('layouts/default.vue', () => {
  describe('route hash handling', () => {
    it('scrolls to element from route hash, offset by header', () => {
      const $route = { hash: '#footer' };
      const $scrollTo = sinon.spy();

      factory({ mocks: { $route, $scrollTo } });

      expect($scrollTo.calledWith(
        '#footer', { duration: 0, easing: 'linear', offset: -0 }
      )).toBe(true);
    });
  });
});
