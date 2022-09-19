import { createLocalVue, mount } from '@vue/test-utils';
import VueI18n from 'vue-i18n';
import SearchResultsContext from '@/components/search/SearchResultsContext.vue';

const localVue = createLocalVue();
localVue.use(VueI18n);

import messages from '@/lang/en';

const i18n = new VueI18n({
  locale: 'en',
  messages: { en: messages }
});

const factory = ({ propsData = {} } = {}) => mount(SearchResultsContext, {
  localVue,
  propsData,
  i18n,
  mocks: {
    $apis: {
      entity: {
        imageUrl: () => ''
      }
    },
    $t: (key) => key,
    $path: (args) => args,
    $route: () => ({})
  },
  stubs: ['RemovalChip']
});

const fixtures = {
  organisationEntity: {
    id: 'http://data.europeana.eu/organization/123',
    prefLabel: { en: 'Organisation' }
  },
  thematicCollectionTopicEntity: {
    id: 'http://data.europeana.eu/concept/190',
    prefLabel: { en: 'Art' }
  }
};

describe('SearchResultsContext', () => {
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
    describe('contextType', () => {
      it('is "theme" if entity is thematic collection topic', () => {
        const propsData = {
          entity: fixtures.thematicCollectionTopicEntity,
          totalResults: 1234
        };

        const wrapper = factory({ propsData });

        expect(wrapper.vm.contextType).toBe('theme');
      });

      it('is "organisation" if entity is organisation', () => {
        const propsData = {
          entity: fixtures.organisationEntity,
          totalResults: 1234
        };

        const wrapper = factory({ propsData });

        expect(wrapper.vm.contextType).toBe('organisation');
      });
    });

    describe('entityLabel', () => {
      it('priorities editorialOverrides prop', () => {
        const propsData = {
          entity: fixtures.organisationEntity,
          totalResults: 1234,
          editorialOverrides: { title: 'override' }
        };

        const wrapper = factory({ propsData });

        expect(wrapper.vm.entityLabel).toEqual('override');
      });

      it('falls back to entity prefLabel', () => {
        const propsData = {
          entity: fixtures.organisationEntity,
          totalResults: 1234
        };

        const wrapper = factory({ propsData });

        expect(wrapper.vm.entityLabel).toEqual(fixtures.organisationEntity.prefLabel);
      });
    });

    describe('entityImage', () => {
      it('prioritises the contentful asset', () => {
        const ctfImage = {
          url: 'https://images.ctfassets.net/i01duvb6kq77/792bNsvUU5gai7bWidjZoz/1d6ce46c91d5fbcd840e8cf8bfe376a3/206_item_QCZITS4J5WNRUS7ESLVJH6PSOCRHBPMI.jpg',
          contentType: 'image/jpeg'
        };
        const propsData = {
          entity: fixtures.organisationEntity,
          totalResults: 1234,
          editorialOverrides: { image: ctfImage }
        };

        const wrapper = factory({ propsData });

        expect(wrapper.vm.entityImage).toEqual(ctfImage.url + '?w=28&h=28&fit=thumb&fm=jpg&fl=progressive&q=80');
      });
    });
  });
});
