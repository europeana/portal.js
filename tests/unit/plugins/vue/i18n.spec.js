import { createLocalVue, shallowMount } from '@vue/test-utils';

import plugin from '@/plugins/vue/i18n';

const component = {
  template: '<div></div>'
};

const localVue = createLocalVue();
localVue.use(plugin);

const factory = (mocks = {}) => shallowMount(component, {
  localVue,
  mocks
});

describe('plugins/vue/i18n', () => {
  it('adds $tNull() to Vue', () => {
    const wrapper = factory();

    expect(typeof wrapper.vm.$tNull).toBe('function');
  });

  it('adds $tcNull() to Vue', () => {
    const wrapper = factory();

    expect(typeof wrapper.vm.$tcNull).toBe('function');
  });

  describe('$tNull()', () => {
    describe('when key exists in current locale', () => {
      const keyArg = 'hello';
      const translation = 'Bonjour';
      const mocks = {
        $te: (key) => key === keyArg,
        $t: (key) => key === keyArg ? translation : null
      };

      it('translates with that key', () => {
        const wrapper = factory(mocks);

        expect(wrapper.vm.$tNull(keyArg)).toBe(translation);
      });
    });

    describe('when key exists in fallback locale, but not current locale', () => {
      const currentLocale = 'fr';
      const fallbackLocale = 'en';
      const keyArg = 'hello';
      const translation = 'Hello';
      const mocks = {
        $te: (key, locale) => (key === keyArg) && (locale === fallbackLocale),
        $t: (key, locale) => (key === keyArg) && (locale === fallbackLocale) ? translation : null,
        $i18n: {
          locale: currentLocale,
          fallbackLocale
        }
      };

      it('translates with that key', () => {
        const wrapper = factory(mocks);

        expect(wrapper.vm.$tNull(keyArg)).toBe(translation);
      });
    });

    describe('when key exists in neither current nor fallback locale', () => {
      const keyArg = 'hello';
      const mocks = {
        $te: () => false,
        $i18n: {}
      };

      it('is null', () => {
        const wrapper = factory(mocks);

        expect(wrapper.vm.$tNull(keyArg) === null);
      });
    });
  });
});
