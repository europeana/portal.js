import { createLocalVue, mount } from '@vue/test-utils';
import sinon from 'sinon';

import SearchResultsContext from '@/components/search/SearchResultsContext.vue';

const localVue = createLocalVue();

const factory = (options = {}) => mount(SearchResultsContext, {
  localVue,
  directives: { 'b-tooltip': () => {} },
  propsData: options.propsData,
  mocks: {
    $config: { app: { search: { translateLocales: 'es', ...options.searchConfig } } },
    $apis: {
      entity: {
        imageUrl: (entity) => entity.logo || entity.isShownBy
      }
    },
    $auth: {
      loggedIn: false,
      ...options.auth
    },
    $features: options.features || {},
    $i18n: { locale: options.locale || 'en', n: (num) => num },
    localePath: (args) => args,
    $route: {
      path: '/search',
      query: {},
      ...options.route
    },
    $store: {
      state: {
        entity: {},
        search: { userParams: {} },
        ...options.storeState
      }
    },
    $t: (key) => key
  },
  stubs: ['SearchRemovalChip', 'b-button', 'b-link', 'i18n']
});

const fixtures = {
  organisationEntity: {
    id: 'http://data.europeana.eu/organization/123',
    prefLabel: { en: 'Organisation' },
    logo: 'organisation logo'
  },
  thematicCollectionTopicEntity: {
    id: 'http://data.europeana.eu/concept/190',
    prefLabel: { en: 'Art' },
    isShownBy: 'topic isShownBy'
  }
};

describe('SearchResultsContext', () => {
  afterEach(sinon.resetHistory);

  describe('template', () => {
    describe('when searching within an entity collection', () => {
      const entity = fixtures.organisationEntity;

      describe('and there are search terms', () => {
        const propsData = {
          entity,
          query: 'painting',
          totalResults: 1234
        };

        it('displays the entity type label', () => {
          const wrapper = factory({ propsData });

          expect(wrapper.text()).toContain('cardLabels.organisation');
        });

        it('displays an entity removal badge', () => {
          const wrapper = factory({ propsData });

          const badge = wrapper.find('[data-qa="entity removal badge"]');

          expect(badge.exists()).toBe(true);
        });

        it('displays a query removal badge', () => {
          const wrapper = factory({ propsData });

          const badge = wrapper.find('[data-qa="query removal badge"]');

          expect(badge.exists()).toBe(true);
        });
      });

      describe('but there are no search terms', () => {
        const propsData = {
          entity,
          query: '',
          totalResults: 1234
        };

        it('displays the entity type label', () => {
          const wrapper = factory({ propsData });

          expect(wrapper.text()).toContain('cardLabels.organisation');
        });

        it('displays an entity removal badge', () => {
          const wrapper = factory({ propsData });

          const badge = wrapper.find('[data-qa="entity removal badge"]');

          expect(badge.exists()).toBe(true);
        });

        it('does not display a query removal badge', () => {
          const wrapper = factory({ propsData });

          const badge = wrapper.find('[data-qa="query removal badge"]');

          expect(badge.exists()).toBe(false);
        });
      });
    });

    describe('when searching without an entity collection', () => {
      const entity = null;

      describe('and there are search terms', () => {
        const propsData = {
          entity,
          query: 'painting',
          totalResults: 1234
        };

        it('displays a query removal badge', () => {
          const wrapper = factory({ propsData });

          const badge = wrapper.find('[data-qa="query removal badge"]');

          expect(badge.exists()).toBe(true);
        });
      });

      describe('and there are no search terms', () => {
        const propsData = {
          entity,
          query: '',
          totalResults: 1234
        };

        it('displays the generic results label', () => {
          const wrapper = factory({ propsData });

          expect(wrapper.vm.i18nPath).toBe('search.results.withoutQuery');
        });

        it('does not display a query removal badge', () => {
          const wrapper = factory({ propsData });

          const badge = wrapper.find('[data-qa="query removal badge"]');

          expect(badge.exists()).toBe(false);
        });
      });
    });
  });

  describe('computed', () => {
    describe('entityLabel', () => {
      it('uses the entity prefLabel', () => {
        const propsData = {
          entity: fixtures.organisationEntity,
          totalResults: 1234
        };

        const wrapper = factory({ propsData });

        expect(wrapper.vm.entityLabel).toEqual(fixtures.organisationEntity.prefLabel);
      });
    });

    describe('entityImage', () => {
      it('uses the imageUrl from the entity', () => {
        const propsData = {
          entity: fixtures.organisationEntity,
          totalResults: 1234
        };

        const wrapper = factory({ propsData });

        expect(wrapper.vm.entityImage).toBe('organisation logo');
      });
    });

    describe('activeCriteria', () => {
      it('includes query params, but not "page"', () => {
        const propsData = {
          entity: fixtures.organisationEntity,
          totalResults: 1234
        };
        const route = {
          path: '/search',
          query: {
            query: 'query',
            view: 'grid',
            boost: 'boost',
            qa: 'qa',
            qf: 'qf',
            reusability: 'reusability',
            page: '2'
          }
        };

        const wrapper = factory({ propsData, route });

        const criteria = wrapper.vm.activeCriteria;

        expect(criteria.query).toBe('query');
        expect(criteria.view).toBe('grid');
        expect(criteria.boost).toBe('boost');
        expect(criteria.qa).toBe('qa');
        expect(criteria.qf).toBe('qf');
        expect(criteria.reusability).toBe('reusability');
        expect(criteria.page).toBe(undefined);
      });
    });
  });

  describe('when multilingual search is enabled for the selected UI language', () => {
    describe('and not logged in', () => {
      describe('searching on keyword', () => {
        const wrapper = factory({
          locale: 'es',
          route: { query: { query: 'casa' } }
        });
        it('suggests to log in to see more results', () => {
          const suggestion = wrapper.find('[data-qa="results more link"]');

          expect(suggestion.attributes('path')).toBe('search.results.loginToSeeMore');
          expect(suggestion.text()).toBe('actions.login');
        });
        it('displays a tooltip explaining the multilingual results', () => {
          const tooltip = wrapper.find('[data-qa="results more tooltip"]');

          expect(tooltip.exists()).toBe(true);
        });
      });
      describe('searrching on a collections page', () => {
        describe('searching on keyword', () => {
          const wrapper = factory({
            propsData: { entity: fixtures.thematicCollectionTopicEntity },
            locale: 'es',
            route: { query: { query: 'casa' } }
          });
          it('suggests to log in to see more results', () => {
            const suggestion = wrapper.find('[data-qa="results more link"]');

            expect(suggestion.exists()).toBe(true);
          });
          it('displays a tooltip explaining the multilingual results', () => {
            const tooltip = wrapper.find('[data-qa="results more tooltip"]');

            expect(tooltip.exists()).toBe(true);
          });
        });

        describe('searching without keyword', () => {
          it('suggests to log in to see more results', () => {
            const wrapper = factory({
              propsData: { entity: fixtures.thematicCollectionTopicEntity },
              locale: 'es'
            });
            const suggestion = wrapper.find('[data-qa="results more link"]');

            expect(suggestion.attributes('path')).toBe('search.results.loginToSeeMore');
            expect(suggestion.text()).toBe('actions.login');
          });
        });
      });
      describe('searching without keyword', () => {
        it('suggests to log in to see more results', () => {
          const wrapper = factory({
            locale: 'es'
          });

          const suggestion = wrapper.find('[data-qa="results more link"]');

          expect(suggestion.attributes('path')).toBe('search.results.loginToSeeMore');
          expect(suggestion.text()).toBe('actions.login');
        });
      });
    });
    describe('and logged in', () => {
      describe('searching on keyword', () => {
        const wrapper = factory({
          auth: { loggedIn: true },
          locale: 'es',
          route: { query: { query: 'casa' } }
        });

        it('does not suggest to log in to see more results', () => {
          const suggestion = wrapper.find('[data-qa="results more link"]');

          expect(suggestion.exists()).toBe(false);
        });
        it('displays a tooltip explaining the multilingual results', () => {
          const tooltip = wrapper.find('[data-qa="results more tooltip"]');

          expect(tooltip.exists()).toBe(true);
        });
      });
    });
  });

  describe('when on the English portal', () => {
    describe('and not logged in', () => {
      describe('searching on keyword', () => {
        const wrapper = factory({
          route: { query: { query: 'casa' } }
        });
        it('does not suggest to log in to see more results', () => {
          const suggestion = wrapper.find('[data-qa="results more link"]');

          expect(suggestion.exists()).toBe(false);
        });
        it('does not display a tooltip explaining the multilingual results', () => {
          const tooltip = wrapper.find('[data-qa="results more tooltip"]');

          expect(tooltip.exists()).toBe(false);
        });
      });
    });
  });
});
