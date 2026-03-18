import { createLocalVue, shallowMount } from '@vue/test-utils';

import mixin from '@/mixins/langAttribute';

const component = {
  template: `
    <div></div>
  `,
  mixins: [mixin]
};

const factory = ({ mocks = {} } = {}) => shallowMount(component, {
  localVue: createLocalVue(),
  mocks
});

describe('mixins/langAttribute', () => {
  describe('methods', () => {
    describe('langAttribute', () => {
      it('returns null if lang matches i18n locale', () => {
        const locale = 'fr';
        const lang = 'fr';
        const mocks = { $i18n: { locale } };
        const wrapper = factory({ mocks });

        const langAttribute = wrapper.vm.langAttribute(lang);

        expect(langAttribute).toBeNull();
      });

      it('returns lang if it does not match i18n locale', () => {
        const locale = 'fr';
        const lang = 'nl';
        const mocks = { $i18n: { locale } };
        const wrapper = factory({ mocks });

        const langAttribute = wrapper.vm.langAttribute(lang);

        expect(langAttribute).toBe(lang);
      });
    });
  });
});
