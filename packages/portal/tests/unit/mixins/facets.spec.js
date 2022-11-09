import { createLocalVue, shallowMount } from '@vue/test-utils';
import VueI18n from 'vue-i18n';

import mixin from '@/mixins/facets';

const component = {
  template: '<div></div>',
  mixins: [mixin]
};

const localVue = createLocalVue();
localVue.use(VueI18n);

const factory = ({ mocks = {}, i18nOptions = {} } = {}) => shallowMount(component, {
  localVue,
  i18n: new VueI18n({
    locale: 'en',
    messages: { en: {} },
    ...i18nOptions
  }),
  mocks: {
    ...mocks
  }
});

describe('mixins/vue/facets', () => {
  describe('methods', () => {
    describe('tNull', () => {
      describe('when key exists in current locale', () => {
        const keyArg = 'hello';
        const translation = 'Bonjour';
        const currentLocale = 'fr';
        const fallbackLocale = 'en';

        const i18nOptions = { locale: currentLocale, fallbackLocale, messages: { [currentLocale]: { [keyArg]: translation } } };

        it('translates with that key', () => {
          const wrapper = factory({ i18nOptions });

          expect(wrapper.vm.tNull(keyArg)).toBe(translation);
        });
      });

      describe('when key exists in fallback locale, but not current locale', () => {
        const currentLocale = 'fr';
        const fallbackLocale = 'en';
        const keyArg = 'hello';
        const translation = 'Hello';

        const i18nOptions = { locale: currentLocale, fallbackLocale, messages: { [fallbackLocale]: { [keyArg]: translation } } };

        it('translates with that key', () => {
          const wrapper = factory({ i18nOptions });

          expect(wrapper.vm.tNull(keyArg)).toBe(translation);
        });
      });

      describe('when key exists in neither current nor fallback locale', () => {
        const keyArg = 'hello';
        const mocks = {
          $te: () => false
        };

        it('is null', () => {
          const wrapper = factory({ mocks });

          expect(wrapper.vm.tNull(keyArg)).toBe(null);
        });
      });
    });

    describe('tFacetName', () => {
      const facetName = 'CREATOR';

      describe('when collection is specified, and collection-specific l10n key exists for the facet', () => {
        const mocks = {
          $tcNull: (key) => key === 'collections.fashion.facets.CREATOR.name' ? 'Designer' : null
        };
        const collection = 'fashion';

        it('uses that key', () => {
          const i18nOptions = { messages: { en: { collections: { fashion: { facets: { 'CREATOR': { name: 'Designer' } } } } }  } };
          const wrapper = factory({ mocks, i18nOptions });

          expect(wrapper.vm.tFacetName(facetName, { collection })).toBe('Designer');
        });
      });

      describe('when collection is not specified', () => {
        describe('but generic l10n key exists for the facet', () => {
          it('uses that key', () => {
            const i18nOptions = { messages: { en: { facets: { 'CREATOR': { name: 'Creator' } } } } };
            const wrapper = factory({ i18nOptions });

            expect(wrapper.vm.tFacetName(facetName)).toBe('Creator');
          });
        });

        describe('and no generic l10n key exists for the facet', () => {
          it('just returns the facet name parameter', () => {
            const wrapper = factory();

            expect(wrapper.vm.tFacetName(facetName)).toBe('CREATOR');
          });
        });
      });
    });

    describe('tFacetOption', () => {
      describe('for MIME_TYPE facet', () => {
        const facetName = 'MIME_TYPE';
        const fieldValue = 'image/jpeg';

        it('uses media type label', () => {
          const wrapper = factory();

          expect(wrapper.vm.tFacetOption(facetName, fieldValue)).toBe('JPEG');
        });

        describe('mediaTypeLabel', () => {
          it('favours translated value', () => {
            const i18nOptions = { messages: { en: { facets: { 'MIME_TYPE': { options: { 'text/plain': 'Plain text' } } } } } };
            const wrapper = factory({ i18nOptions });

            const facetName = 'MIME_TYPE';
            const fieldValue = 'text/plain';

            expect(wrapper.vm.tFacetOption(facetName, fieldValue)).toBe('Plain text');
          });

          describe('fallback with no translation', () => {
            it('uppercases the subtype', () => {
              const wrapper = factory();
              const facetName = 'MIME_TYPE';
              const fieldValue = 'image/jpeg';

              expect(wrapper.vm.tFacetOption(facetName, fieldValue)).toBe('JPEG');
            });

            it('removes a leading "x-" from the subtype', () => {
              const wrapper = factory();

              const facetName = 'MIME_TYPE';
              const fieldValue = 'audio/x-flac';

              expect(wrapper.vm.tFacetOption(facetName, fieldValue)).toBe('FLAC');
            });
          });
        });
      });

      describe('not for MIME_TYPE facet', () => {
        it('uses generic label', () => {
          const wrapper = factory();

          const facetName = 'TYPE';
          const fieldValue = 'VIDEO';

          expect(wrapper.vm.tFacetOption(facetName, fieldValue)).toBe('VIDEO');
        });

        describe('with escaped set to `true`', () => {
          it('removes quotes from the field value', () => {
            const wrapper = factory();

            const facetName = 'TYPE';
            const fieldValue = '"IMAGE"';

            expect(wrapper.vm.tFacetOption(facetName, fieldValue, { escaped: true })).toBe('IMAGE');
          });

          it('removes Lucene special character escaping', () => {
            const wrapper = factory();

            const facetName = 'DATA_PROVIDER';
            const fieldValue = '"Nederlands Bakkerijmuseum \\"Het Warme Land\\""';

            expect(wrapper.vm.tFacetOption(facetName, fieldValue, { escaped: true })).toBe('Nederlands Bakkerijmuseum "Het Warme Land"');
          });
        });

        it('translates the field value', () => {
          const i18nOptions = { messages: { en: { facets: { 'TYPE': { options: { 'IMAGE': 'Image' } } } } } };
          const wrapper = factory({ i18nOptions });

          const facetName = 'TYPE';
          const fieldValue = 'IMAGE';

          expect(wrapper.vm.tFacetOption(facetName, fieldValue)).toBe('Image');
        });

        it('falls back to the field value if no translation', () => {
          const wrapper = factory();

          const facetName = 'TYPE';
          const fieldValue = 'IMAGE';

          expect(wrapper.vm.tFacetOption(facetName, fieldValue)).toBe('IMAGE');
        });

        describe('with theme-specific field label pattern', () => {
          it('removes it', () => {
            const wrapper = factory();

            const facetName = 'CREATOR';
            const fieldValue = 'Chanel (Designer)';
            const collection = 'fashion';

            expect(wrapper.vm.tFacetOption(facetName, fieldValue, { collection })).toBe('Chanel');
          });
        });
      });
    });
  });
});
