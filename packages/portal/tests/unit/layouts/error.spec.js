import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../utils';
// import BootstrapVue from 'bootstrap-vue';

import layout from '@/layouts/error';

const localVue = createLocalVue();
// localVue.use(BootstrapVue);

const error = { message: 'something went wrong' };
const notFoundError = { message: 'Page not found', statusCode: 404 };

const factory = (propsData = { error }) => shallowMountNuxt(layout, {
  localVue,
  propsData,
  mocks: {
    $pageHeadTitle: key => key,
    $t: key => key
  },
  stubs: {
    ErrorMessage: true
  }
});

describe('layouts/default.vue', () => {
  it('shows an error message', () => {
    const wrapper = factory();
    const errorMessage = wrapper.find('[data-qa="error message container"]');

    expect(errorMessage.exists()).toBe(true);
  });

  describe('head()', () => {
    it('sets meta title', () => {
      const wrapper = factory();

      expect(wrapper.vm.head().title).toEqual('error');
    });
  });

  describe('when there is a 404 error', () => {
    it('has an error explanation', () => {
      const wrapper = factory({ error: notFoundError });
      expect(wrapper.vm.errorExplanation).toBeTruthy();
    });

    it('sets custom meta title', () => {
      const wrapper = factory({ error: notFoundError });

      expect(wrapper.vm.head().title).toEqual(wrapper.vm.errorExplanation.metaTitlePath);
    });
  });
});
