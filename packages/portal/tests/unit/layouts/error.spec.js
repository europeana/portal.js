import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../utils';
import BootstrapVue from 'bootstrap-vue';

import layout from '@/layouts/error';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ propsData = {}, data = {} } = {}) => shallowMountNuxt(layout, {
  localVue,
  propsData,
  data() {
    return { ...data };
  },
  mocks: {
    $config: {
      app: {
        siteName: 'Europeana'
      }
    },
    $t: (key) => key
  },
  stubs: {
    ErrorMessage: true
  }
});

describe('layouts/error.vue', () => {
  const error = { message: 'Not Found' };

  describe('template', () => {
    it('includes error message', () => {
      const wrapper = factory({ propsData: { error } });

      const errorMessage = wrapper.find('[data-qa="error message container"]');

      expect(errorMessage.exists()).toBe(true);
    });

    describe('when there is a 404 error', () => {
      const error = { statusCode: 404, message: 'Not Found' };

      it('has an error explanation', () => {
        const wrapper = factory({ propsData: { error } });
        expect(wrapper.vm.errorExplanation).toBeTruthy();
      });

      it('sets custom meta title', () => {
        const wrapper = factory({ propsData: { error } });

        expect(wrapper.vm.head().title).toBe('errorMessage.pageNotFound.metaTitle | Europeana');
      });
    });
  });

  describe('head', () => {
    describe('title', () => {
      it('defaults to "Error" (translated)', () => {
        const wrapper = factory({ propsData: { error } });

        const headTitle = wrapper.vm.head().title;

        expect(headTitle).toBe('error | Europeana');
      });
    });
  });
});
