import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../utils';
import sinon from 'sinon';

import mixin from '@/mixins/scrollToRouteHash';

const component = {
  template: '<div></div>',
  mixins: [mixin]
};

const localVue = createLocalVue();

const factory = ({ mocks = {} } = {}) => shallowMountNuxt(component, {
  localVue,
  mocks: {
    $route: {},
    $scrollTo: sinon.spy(),
    ...mocks
  }
});

describe('mixins/redirectTo', () => {
  afterEach(sinon.resetHistory);
  afterAll(() => {
    sinon.reset();
  });

  describe('methods', () => {
    describe('scrollToRouteHash', () => {
      it('scrolls to the hash from the route', () => {
        const hash = '#sign-up';
        const wrapper = factory({ mocks: { $route: { hash } } });

        wrapper.vm.scrollToRouteHash();

        expect(wrapper.vm.$scrollTo.calledWith(
          '#sign-up', { duration: 0, easing: 'linear', offset: 0 }
        )).toBe(true);
      });
    });
  });
});
