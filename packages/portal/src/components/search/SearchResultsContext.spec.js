import { createLocalVue, mount } from '@vue/test-utils';
import sinon from 'sinon';

import SearchResultsContext from '@/components/search/SearchResultsContext.vue';

const localVue = createLocalVue();

const factory = ({ propsData, provide, route, storeState } = {}) => mount(SearchResultsContext, {
  localVue,
  directives: { 'b-tooltip': () => {} },
  propsData,
  mocks: {
    $apis: {
      entity: {
        imageUrl: (entity) => entity.logo || entity.isShownBy
      }
    },
    $i18n: { n: (num) => num },
    $route: {
      path: '/search',
      query: {},
      ...route
    },
    $store: {
      state: {
        search: { userParams: {} },
        ...storeState
      }
    },
    $t: (key) => key
  },
  provide: {
    currentEntity: {},
    ...provide
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
          query: 'painting',
          totalResults: 1234
        };
        const provide = {
          currentEntity: entity
        };

        it('displays the entity type label', () => {
          const wrapper = factory({ propsData, provide });

          expect(wrapper.text()).toContain('cardLabels.organisation');
        });

        it('displays an entity removal badge', () => {
          const wrapper = factory({ propsData, provide });

          const badge = wrapper.find('[data-qa="entity removal badge"]');

          expect(badge.exists()).toBe(true);
        });

        it('displays a query removal badge', () => {
          const wrapper = factory({ propsData, provide });

          const badge = wrapper.find('[data-qa="query removal badge"]');

          expect(badge.exists()).toBe(true);
        });
      });

      describe('but there are no search terms', () => {
        const propsData = {
          query: '',
          totalResults: 1234
        };
        const provide = {
          currentEntity: entity
        };

        it('displays the entity type label', () => {
          const wrapper = factory({ propsData, provide });

          expect(wrapper.text()).toContain('cardLabels.organisation');
        });

        it('displays an entity removal badge', () => {
          const wrapper = factory({ propsData, provide });

          const badge = wrapper.find('[data-qa="entity removal badge"]');

          expect(badge.exists()).toBe(true);
        });

        it('does not display a query removal badge', () => {
          const wrapper = factory({ propsData, provide });

          const badge = wrapper.find('[data-qa="query removal badge"]');

          expect(badge.exists()).toBe(false);
        });
      });

      describe('when the organisation is an aggregator', () => {
        const propsData = {
          query: '',
          totalResults: 1234
        };
        const provide = {
          currentEntity: {
            europeanaRole: [{ id: 'http://data.europeana.eu/vocabulary/role/Aggregator' }],
            ...entity
          }
        };

        it('displays the aggregator type label', () => {
          const wrapper = factory({ propsData, provide });

          expect(wrapper.text()).toContain('cardLabels.aggregator');
        });
      });
    });

    describe('when searching without an entity collection', () => {
      const entity = null;

      describe('and there are search terms', () => {
        const propsData = {
          query: 'painting',
          totalResults: 1234
        };
        const provide = {
          currentEntity: entity
        };

        it('displays a query removal badge', () => {
          const wrapper = factory({ propsData, provide });

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
        const provide = {
          currentEntity: entity
        };

        it('displays the generic results label', () => {
          const wrapper = factory({ propsData, provide });

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
          totalResults: 1234
        };
        const provide = {
          currentEntity: fixtures.organisationEntity
        };

        const wrapper = factory({ propsData, provide });

        expect(wrapper.vm.entityLabel).toEqual(fixtures.organisationEntity.prefLabel);
      });
    });

    describe('entityImage', () => {
      it('uses the imageUrl from the entity', () => {
        const propsData = {
          totalResults: 1234
        };
        const provide = {
          currentEntity: fixtures.organisationEntity
        };

        const wrapper = factory({ propsData, provide });

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
});
