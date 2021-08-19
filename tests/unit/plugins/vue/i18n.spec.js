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

    (typeof wrapper.vm.$tNull).should.eq('function');
  });

  it('adds $tcNull() to Vue', () => {
    const wrapper = factory();

    (typeof wrapper.vm.$tcNull).should.eq('function');
  });

  describe('$tNull()', () => {
    context('when key exists in current locale', () => {
      const keyArg = 'hello';
      const translation = 'Bonjour';
      const mocks = {
        $te: (key) => key === keyArg,
        $t: (key) => key === keyArg ? translation : null
      };

      it('translates with that key', () => {
        const wrapper = factory(mocks);

        wrapper.vm.$tNull(keyArg).should.eq(translation);
      });
    });

    context('when key exists in fallback locale, but not current locale', () => {
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

        wrapper.vm.$tNull(keyArg).should.eq(translation);
      });
    });

    context('when key exists in neither current nor fallback locale', () => {
      const keyArg = 'hello';
      const mocks = {
        $te: () => false,
        $i18n: {}
      };

      it('is null', () => {
        const wrapper = factory(mocks);

        (wrapper.vm.$tNull(keyArg) === null).should.be.true;
      });
    });
  });
});
