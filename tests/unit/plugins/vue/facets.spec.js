import { createLocalVue, shallowMount } from '@vue/test-utils';

import plugin from '../../../../plugins/vue/facets';

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

    (typeof wrapper.vm.$tFacetName).should.eq('function');
  });

  describe('$tFacetName()', () => {
    const facetName = 'CREATOR';

    context('when theme is set in store, and theme-specific l10n key exists for the facet', () => {
      const mocks = {
        $tcNull: (key) => key === 'themes.fashion.facets.CREATOR.name' ? 'Designer' : null,
        $store: {
          getters: {
            'search/theme': 'fashion'
          }
        }
      };

      it('uses that key', () => {
        const wrapper = factory(mocks);

        wrapper.vm.$tFacetName(facetName).should.eq('Designer');
      });
    });

    context('when theme is not set in store', () => {
      context('but generic l10n key exists for the facet', () => {
        const mocks = {
          $tcNull: (key) => key === 'facets.CREATOR.name' ? 'Creator' : null,
          $store: {
            getters: {
              'search/theme': null
            }
          }
        };

        it('uses that key', () => {
          const wrapper = factory(mocks);

          wrapper.vm.$tFacetName(facetName).should.eq('Creator');
        });
      });

      context('and no generic l10n key exists for the facet', () => {
        const mocks = {
          $tcNull: () => null,
          $store: {
            getters: {
              'search/theme': null
            }
          }
        };

        it('just returns the facet name parameter', () => {
          const wrapper = factory(mocks);

          wrapper.vm.$tFacetName(facetName).should.eq('CREATOR');
        });
      });
    });
  });
});
