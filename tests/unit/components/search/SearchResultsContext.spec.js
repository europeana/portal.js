import { createLocalVue, shallowMount } from '@vue/test-utils';

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
      state: {
        entity: {},
        search: { userParams: {} },
        ...options.storeState
      }
    }
  },
  stubs: ['i18n']
});

const fixtures = {
  organisationEntity: {
    id: 'http://data.europeana.eu/organization/123',
    prefLabel: { en: 'Organisation' }
  },
  thematicCollectionTopicEntity: {
    id: 'http://data.europeana.eu/concept/base/190',
    prefLabel: { en: 'Art' }
  }
};

describe('SearchResultsContext', () => {
  describe('template', () => {
    describe('when searching within an entity collection', () => {
      const entity = {
        entity: fixtures.organisationEntity
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

  describe('computed', () => {
    describe('contextType', () => {
      it('is "theme" if entity is thematic collection topic', () => {
        const storeState = {
          entity: { entity: fixtures.thematicCollectionTopicEntity }
        };

        const wrapper = factory({ storeState });

        expect(wrapper.vm.contextType).toBe('theme');
      });

      it('is "organisation" if entity is organisation', () => {
        const storeState = {
          entity: { entity: fixtures.organisationEntity }
        };

        const wrapper = factory({ storeState });

        expect(wrapper.vm.contextType).toBe('organisation');
      });
    });

    describe('localisedEntityLabel', () => {
      it('priorities labelOverride prop', () => {
        const storeState = {
          entity: { entity: fixtures.organisationEntity }
        };
        const propsData = { labelOverride: 'override' };

        const wrapper = factory({ propsData, storeState });

        expect(wrapper.vm.localisedEntityLabel).toEqual({ values: ['override'], code: null });
      });

      it('falls back to entity prefLabel', () => {
        const storeState = {
          entity: { entity: fixtures.organisationEntity }
        };
        const propsData = {};

        const wrapper = factory({ propsData, storeState });

        expect(wrapper.vm.localisedEntityLabel).toEqual(fixtures.organisationEntity.prefLabel);
      });
    });
  });
});
