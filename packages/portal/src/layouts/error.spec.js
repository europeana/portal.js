import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';
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
  });

  describe('computed', () => {
    describe('pageMeta', () => {
      it('defaults title to "Error" (translated)', () => {
        const wrapper = factory({ propsData: { error } });

        const headTitle = wrapper.vm.pageMeta.title;

        expect(headTitle).toBe('error');
      });
    });
  });
});
