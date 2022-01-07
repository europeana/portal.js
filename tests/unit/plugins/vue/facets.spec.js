import { createLocalVue, shallowMount } from '@vue/test-utils';

import plugin from '@/plugins/vue/facets';

const component = {
  template: '<div></div>'
};

const localVue = createLocalVue();
localVue.use(plugin);

const factory = (mocks = {}) => shallowMount(component, {
  localVue,
  mocks
});

describe('plugins/vue/facets', () => {
  it('adds $tFacetName() to Vue', () => {
    const wrapper = factory();

    expect(typeof wrapper.vm.$tFacetName).toBe('function');
  });

  describe('$tFacetName()', () => {
    const facetName = 'CREATOR';

    describe('when collection is set in store, and collection-specific l10n key exists for the facet', () => {
      const mocks = {
        $tcNull: (key) => key === 'collections.fashion.facets.CREATOR.name' ? 'Designer' : null,
        $store: {
          getters: {
            'search/collection': 'fashion'
          }
        }
      };

      it('uses that key', () => {
        const wrapper = factory(mocks);

        expect(wrapper.vm.$tFacetName(facetName)).toBe('Designer');
      });
    });

    describe('when collection is not set in store', () => {
      describe('but generic l10n key exists for the facet', () => {
        const mocks = {
          $tcNull: (key) => key === 'facets.CREATOR.name' ? 'Creator' : null,
          $store: {
            getters: {
              'search/collection': null
            }
          }
        };

        it('uses that key', () => {
          const wrapper = factory(mocks);

          expect(wrapper.vm.$tFacetName(facetName)).toBe('Creator');
        });
      });

      describe('and no generic l10n key exists for the facet', () => {
        const mocks = {
          $tcNull: () => null,
          $store: {
            getters: {
              'search/collection': null
            }
          }
        };

        it('just returns the facet name parameter', () => {
          const wrapper = factory(mocks);

          expect(wrapper.vm.$tFacetName(facetName)).toBe('CREATOR');
        });
      });
    });
  });
});
