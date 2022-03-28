import { createLocalVue, shallowMount } from '@vue/test-utils';
// import VueI18n from 'vue-i18n';

import mixin from '@/mixins/stringify';

const component = {
  template: '<div></div>',
  mixins: [mixin]
};

// const defaultMocks = {
//   $store: {
//     getters: {
//       'search/collection': null
//     }
//   }
// };

const localVue = createLocalVue();
// localVue.use(VueI18n);

const factory = () => shallowMount(component, {
  localVue
  // i18n: new VueI18n({
  //   locale: 'en',
  //   messages: { en: {} },
  //   ...i18nOptions
  // }),
  // mocks: {
  //   ...defaultMocks,
  //   ...mocks
  // }
});

describe('mixins/vue/facets', () => {
  describe('stringify()', () => {
    describe('when field is not a literal', () => {
      it('returns a literal value', () => {
        const wrapper = factory();

        expect(wrapper.vm.stringify({ values: ['provider'] })).toBe('provider');
      });
    });
    describe('when field is a literal', () => {
      it('returns the value', () => {
        const wrapper = factory();

        expect(wrapper.vm.stringify('provider')).toBe('provider');
      });
    });
  });
});
