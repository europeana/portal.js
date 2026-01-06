import { createLocalVue, shallowMount } from '@vue/test-utils';

import mixin from '@/mixins/europeana/item/itemPrefLanguage';

const component = {
  template: '<div></div>',
  mixins: [mixin]
};

const edmDataProvider = (prefLabel) => {
  return {
    url: 'https://www.example.eu',
    value: {
      def: [{
        prefLabel
      }]
    }
  };
};

const edmProvider = (prefLabel) => {
  return {
    def: [{
      prefLabel
    }]
  };
};

const UILocale = 'es';
const metadataLanguage = 'de';

const localVue = createLocalVue();

const factory = (mocks = {}) => shallowMount(component, {
  localVue,
  mocks: {
    $i18n: {
      locale: UILocale
    },
    ...mocks
  }
});

describe('@/mixins/europeana/item/itemPrefLanguage', () => {
  describe('methods', () => {
    describe('getPrefLanguage', () => {
      describe('when looking for (data) provider fields', () => {
        it('returns the native locale for data providers when definable', () => {
          const prefLabel = {
            en: 'English name',
            nl: 'Nederlandse naam'
          };

          const prefLanguage = factory().vm.getPrefLanguage('edmDataProvider', edmDataProvider(prefLabel));

          expect(prefLanguage).toBe('nl');
        });

        it('returns the native locale for providers when definable', () => {
          const prefLabel = {
            en: 'English name'
          };

          const prefLanguage = factory().vm.getPrefLanguage('edmProvider', edmProvider(prefLabel));

          expect(prefLanguage).toBe('en');
        });

        it('returns the UI locale when native locale not definable', () => {
          const prefLabel = {
            en: 'English name',
            nl: 'Nederlandse naam',
            fr: 'Nomme française',
            [UILocale]: 'Nombre nativo'
          };

          const prefLanguage = factory().vm.getPrefLanguage('edmDataProvider', edmDataProvider(prefLabel));

          expect(prefLanguage).toBe(UILocale);
        });
      });
    });
    it('returns the metadate selected language', () => {
      const wrapper = factory({ metadataLanguage });

      const prefLanguage = wrapper.vm.getPrefLanguage('year');

      expect(prefLanguage).toBe(metadataLanguage);
    });
  });
});
