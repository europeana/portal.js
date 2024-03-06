import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';

import mixin from '@/mixins/klaro';

const component = {
  template: '<div/>',
  mixins: [mixin]
};

const factory = ({ mocks = {} } = {}) => shallowMount(component, {
  localVue: createLocalVue(),
  mocks: {
    $route: { params: {} },
    ...mocks
  }
});

describe('mixins/klaro', () => {
  afterEach(sinon.resetHistory);

  describe('mounted', () => {
    it('renders klaro', async() => {
      sinon.spy(mixin.methods, 'renderKlaro');

      const wrapper = factory();
      await new Promise(process.nextTick);

      expect(mixin.methods.renderKlaro.called).toBe(true);
    });
  });
});
