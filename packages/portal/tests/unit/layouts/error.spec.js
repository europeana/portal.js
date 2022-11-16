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
  }
});

describe('layouts/error.vue', () => {
  const error = { message: 'Not Found' };

  describe('template', () => {
    it('includes error message text', () => {
      const wrapper = factory({ propsData: { error } });

      const text = wrapper.text();

      expect(text.includes(error.message)).toBe(true);
    });
  });

  describe('head', () => {
    describe('title', () => {
      it('defaults to "Error" (translated)', () => {
        const pageMeta = {};
        const wrapper = factory({ propsData: { error } });

        const headTitle = wrapper.vm.head().title;

        expect(headTitle).toBe('error | Europeana');
      });
    });
  });
});
