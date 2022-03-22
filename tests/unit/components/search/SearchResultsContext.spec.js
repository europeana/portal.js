import { createLocalVue, shallowMount } from '@vue/test-utils';
// import BootstrapVue from 'bootstrap-vue';
// import sinon from 'sinon';

import SearchResultsContext from '@/components/search/SearchResultsContext.vue';

const localVue = createLocalVue();

const factory = (options = {}) => shallowMount(SearchResultsContext, {
  localVue,
  propsData: options.propsData,
  mocks: {
    $t: (key) => key,
    $path: (args) => args,
    $route: () => ({}),
    $store: {
      state: options.storeState
    }
  },
  stubs: ['i18n']
});

describe('SearchResultsContext', () => {
  describe('template', () => {
    describe('when searching within an entity collection', () => {
      const entity = {
        entity: {
          id: 'http://data.europeana.eu/organization/123',
          prefLabel: { en: 'Organisation' }
        }
      };

      describe('and there are search terms', () => {
        const storeState = {
          entity,
          search: {
            userParams: {
              query: 'painting'
            }
          }
        };

        it('displays the entity type label', () => {
          const wrapper = factory({ storeState });

          expect(wrapper.text()).toContain('cardLabels.organisation');
        });

        it('displays an entity removal badge', () => {
          const wrapper = factory({ storeState });

          const badge = wrapper.find('[data-qa="entity removal badge"]');

          expect(badge.exists()).toBe(true);
        });

        it('displays a query removal badge', () => {
          const wrapper = factory({ storeState });

          const badge = wrapper.find('[data-qa="query removal badge"]');

          expect(badge.exists()).toBe(true);
        });
      });

      describe('but there are no search terms', () => {
        const storeState = {
          entity,
          search: {
            userParams: {
              query: ''
            }
          }
        };

        it('displays the entity type label', () => {
          const wrapper = factory({ storeState });

          expect(wrapper.text()).toContain('cardLabels.organisation');
        });

        it('displays an entity removal badge', () => {
          const wrapper = factory({ storeState });

          const badge = wrapper.find('[data-qa="entity removal badge"]');

          expect(badge.exists()).toBe(true);
        });

        it('does not display a query removal badge', () => {
          const wrapper = factory({ storeState });

          const badge = wrapper.find('[data-qa="query removal badge"]');

          expect(badge.exists()).toBe(false);
        });
      });
    });

    describe('when searching without an entity collection', () => {
      const entity = {};

      describe('and there are search terms', () => {
        const storeState = {
          entity,
          search: {
            userParams: {
              query: 'painting'
            }
          }
        };

        it('displays a query removal badge', () => {
          const wrapper = factory({ storeState });

          const badge = wrapper.find('[data-qa="query removal badge"]');

          expect(badge.exists()).toBe(true);
        });
      });

      describe('but there are no search terms', () => {
        const storeState = {
          entity,
          search: {
            userParams: {
              query: ''
            }
          }
        };

        it('displays the generic results label', () => {
          const wrapper = factory({ storeState });

          expect(wrapper.text()).toContain('results');
        });

        it('does not display a query removal badge', () => {
          const wrapper = factory({ storeState });

          const badge = wrapper.find('[data-qa="query removal badge"]');

          expect(badge.exists()).toBe(false);
        });
      });
    });
  });
});
