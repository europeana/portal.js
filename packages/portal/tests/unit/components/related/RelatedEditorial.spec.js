import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import sinon from 'sinon';

import RelatedEditorial from '@/components/related/RelatedEditorial.vue';

const localVue = createLocalVue();

const primaryImageOfPage = { image: {} };
const contentfulQueryResponse = {
  data: {
    data: {
      storyCollection: {
        items: [
          { identifier: 'story-1', datePublished: '2022-04-30T00:00:00.000+00:00', primaryImageOfPage },
          { identifier: 'story-2', datePublished: '2022-04-20T00:00:00.000+00:00', primaryImageOfPage },
          { identifier: 'story-3', datePublished: '2022-04-10T00:00:00.000+00:00', primaryImageOfPage }
        ]
      },
      exhibitionPageCollection: {
        items: [
          { identifier: 'exhibition-1', datePublished: '2022-04-25T00:00:00.000+00:00', primaryImageOfPage },
          { identifier: 'exhibition-2', datePublished: '2022-04-24T00:00:00.000+00:00', primaryImageOfPage },
          { identifier: 'exhibition-3', datePublished: '2022-04-05T00:00:00.000+00:00', primaryImageOfPage }
        ]
      }
    }
  }
};
const relatedEditorialIdentifiers = ['story-1', 'exhibition-1', 'exhibition-2', 'story-2'];

const factory = ({ propsData, mocks } = {})  => shallowMountNuxt(RelatedEditorial, {
  localVue,
  propsData,
  mocks: {
    $contentful: {
      query: sinon.stub().resolves(contentfulQueryResponse)
    },
    $i18n: {
      localeProperties: { iso: 'en-GB' }
    },
    $route: {
      query: {}
    },
    $t: (key) => key,
    ...mocks
  },
  stubs: ['b-card-group', 'b-card']
});

describe('components/related/RelatedEditorial', () => {
  afterEach(sinon.resetHistory);

  describe('fetch', () => {
    describe('when an entity URI is supplied', () => {
      const entityUri = 'http://data.europeana.eu/concept/123';

      describe('and a query is supplied', () => {
        const query = 'spider';

        it('queries Contentful for content related to the entity, filtered by the query', async() => {
          const wrapper = factory({ propsData: { entityUri, query } });

          await wrapper.vm.fetch();

          expect(wrapper.vm.$contentful.query.calledWith('entityRelatedContent', {
            theme: null,
            entityUri,
            query,
            locale: 'en-GB',
            preview: false,
            limit: 4
          })).toBe(true);
        });

        it('stores 4 most recent entries', async() => {
          const wrapper = factory({ propsData: { entityUri, query } });

          await wrapper.vm.fetch();

          expect(wrapper.vm.related.map(entry => entry.identifier)).toEqual(relatedEditorialIdentifiers);
        });
      });

      describe('but no query is supplied', () => {
        it('queries Contentful for content related to the entity, with an empty string for the query', async() => {
          const wrapper = factory({ propsData: { entityUri } });

          await wrapper.vm.fetch();

          expect(wrapper.vm.$contentful.query.calledWith('entityRelatedContent', {
            entityUri,
            query: '',
            theme: null,
            locale: 'en-GB',
            preview: false,
            limit: 4
          })).toBe(true);
        });

        it('stores 4 most recent entries', async() => {
          const wrapper = factory({ propsData: { entityUri } });

          await wrapper.vm.fetch();

          expect(wrapper.vm.related.map(entry => entry.identifier)).toEqual(relatedEditorialIdentifiers);
        });
      });
    });

    describe('when no entity URI is supplied, but a theme is supplied', () => {
      const theme = 'nature';
      describe('and a query is supplied', () => {
        const query = 'crab';

        it('queries Contentful for content related to the theme, filtered by the query', async() => {
          const wrapper = factory({ propsData: { theme, query } });

          await wrapper.vm.fetch();

          expect(wrapper.vm.$contentful.query.calledWith('themeRelatedContent', {
            theme,
            entityUri: null,
            query,
            locale: 'en-GB',
            preview: false,
            limit: 4
          })).toBe(true);
        });

        it('stores 4 most recent entries', async() => {
          const wrapper = factory({ propsData: { theme, query } });

          await wrapper.vm.fetch();

          expect(wrapper.vm.related.map(entry => entry.identifier)).toEqual(relatedEditorialIdentifiers);
        });
      });

      describe('but no query is supplied', () => {
        it('queries Contentful for content related to the theme, with an empty string for the query', async() => {
          const wrapper = factory({ propsData: { theme } });

          await wrapper.vm.fetch();

          expect(wrapper.vm.$contentful.query.calledWith('themeRelatedContent', {
            entityUri: null,
            query: '',
            theme,
            locale: 'en-GB',
            preview: false,
            limit: 4
          })).toBe(true);
        });

        it('stores 4 most recent entries', async() => {
          const wrapper = factory({ propsData: { theme } });

          await wrapper.vm.fetch();

          expect(wrapper.vm.related.map(entry => entry.identifier)).toEqual(relatedEditorialIdentifiers);
        });
      });
    });

    describe('when no entity URI or theme is supplied', () => {
      const entityUri = null;

      describe('but a query is supplied', () => {
        const query = 'spider';

        it('queries Contentful for content filtered by the query', async() => {
          const wrapper = factory({ propsData: { query, entityUri } });

          await wrapper.vm.fetch();

          expect(wrapper.vm.$contentful.query.calledWith('relatedContent', {
            entityUri,
            query,
            theme: null,
            locale: 'en-GB',
            preview: false,
            limit: 4
          })).toBe(true);
        });

        it('stores 4 most recent entries', async() => {
          const wrapper = factory({ propsData: { query, entityUri } });

          await wrapper.vm.fetch();

          expect(wrapper.vm.related.map(entry => entry.identifier)).toEqual(relatedEditorialIdentifiers);
        });
      });

      describe('and no query is supplied', () => {
        it('does not query Contentful', async() => {
          const wrapper = factory();

          await wrapper.vm.fetch();

          expect(wrapper.vm.$contentful.query.called).toBe(false);
        });
      });
    });
  });

  describe('methods', () => {
    describe('entryUrl', () => {
      it('prefixes Story entries with /stories', () => {
        const wrapper = factory();

        const entryUrl = wrapper.vm.entryUrl({
          '__typename': 'Story',
          identifier: 'interesting'
        });

        expect(entryUrl).toBe('/stories/interesting');
      });

      it('prefixes ExhibitionPage entries with /exhibitions', () => {
        const wrapper = factory();

        const entryUrl = wrapper.vm.entryUrl({
          '__typename': 'ExhibitionPage',
          identifier: 'educational'
        });

        expect(entryUrl).toBe('/exhibitions/educational');
      });
    });
  });
});
