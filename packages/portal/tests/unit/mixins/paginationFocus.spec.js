import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../utils';

import mixin from '@/mixins/paginationFocus';

const localVue = createLocalVue();

const factory = ({ data = {}, mocks = {} } = {}) => {
  const component = {
    template: '<div></div>',
    data: () => ({ ...data }),
    mixins: [mixin]
  };

  const wrapper = shallowMountNuxt(component, {
    localVue,
    mocks: {
      ...mocks
    }
  });

  return wrapper;
};

describe('mixins/paginationFocus', () => {
  describe('methods', () => {
    describe('focusFirstPaginatedElementLink', () => {
      test.todo('can be disabled')

      test.todo('quits if refs not initialised')

      test.todo('')
    });
  });
});
