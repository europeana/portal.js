import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import sinon from 'sinon';
import BootstrapVue from 'bootstrap-vue';

import BrowseAutomatedCardGroup from '@/components/browse/BrowseAutomatedCardGroup.vue';
import * as useContentfulGraphqlModule from '@/composables/contentful/useContentfulGraphql.js';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const FEATURED_ORGANISATIONS = 'Featured organisations';
const FEATURED_THEMES = 'Featured themes';
const FEATURED_TOPICS = 'Featured topics';
const FEATURED_TIMES = 'Featured centuries';
const RECENT_ITEMS = 'Recent items';
const ITEM_COUNTS_MEDIA_TYPE = 'Item counts by media type';
const LATEST_GALLERIES = 'Latest galleries';
const TRENDING_ITEMS = 'Trending items';

const $axiosGetStub = sinon.stub();

const factory = (propsData = { sectionType: FEATURED_TOPICS })  => shallowMountNuxt(BrowseAutomatedCardGroup, {
  localVue,
  propsData,
  mocks: {
    $apis: {
      entity: {
        imageUrl: () => 'image URL'
      },
      thumbnail: {
        edmPreview: sinon.stub().returnsArg(0)
      },
      set: {
        search: sinon.stub()
      }
    },
    localePath: () => 'mocked path',
    $i18n: { locale: 'en', t: (key) => key, n: (num) => `${num}`, localeProperties: { iso: 'en-GB' } },
    $route: { query: {} },
    $axios: {
      get: $axiosGetStub
    },
    $config: { app: { internalLinkDomain: 'https://europeana.eu' } },
    $t: (key) => key
  }
});

const entries = {
  featuredOrganisations: [
    {
      id: 'http://data.europeana.eu/organization/1',
      prefLabel: { en: 'organisation one' },
      logo: { id: 'http://commons.wikimedia.org/wiki/Special:FilePath/logo.jpg' }
    },
    {
      id: 'http://data.europeana.eu/organization/2',
      prefLabel: { en: 'organisation two' }
    },
    {
      id: 'http://data.europeana.eu/organization/3',
      prefLabel: { en: 'organisation three' }
    },
    {
      id: 'http://data.europeana.eu/organization/4',
      prefLabel: { en: 'organisation four' }
    }
  ],
  featuredTopics: [
    {
      id: 'http://data.europeana.eu/concept/1',
      prefLabel: { en: 'topic one' },
      isShownBy: { thumbnail: 'thumbnail' }
    },
    {
      id: 'http://data.europeana.eu/concept/2',
      prefLabel: { en: 'topic two' }
    },
    {
      id: 'http://data.europeana.eu/concept/3',
      prefLabel: { en: 'topic three' }
    },
    {
      id: 'http://data.europeana.eu/concept/4',
      prefLabel: { en: 'topic four' }
    }
  ],
  featuredTimes: [
    {
      id: 'http://data.europeana.eu/timespan/1',
      prefLabel: { en: 'time one' },
      isShownBy: { thumbnail: 'thumbnail' }
    },
    {
      id: 'http://data.europeana.eu/timespan/2',
      prefLabel: { en: 'time two' }
    },
    {
      id: 'http://data.europeana.eu/timespan/3',
      prefLabel: { en: 'time three' }
    },
    {
      id: 'http://data.europeana.eu/timespan/4',
      prefLabel: { en: 'time four' }
    }
  ],
  recentItems: [{
    id: '/500/identifier_1',
    edmIsShownBy: 'isShownBy URL',
    edmPreview: 'preview URL',
    title: 'item one'
  }],
  itemTypeCounts: [
    {
      label: 'IMAGE',
      count: 100
    },
    {
      label: 'TEXT',
      count: 200
    },
    {
      label: 'SOUND',
      count: 300
    },
    {
      label: 'VIDEO',
      count: 400
    },
    {
      label: '3D',
      count: 500
    }
  ],
  latestGalleries: [
    { id: '001',
      title: { en: 'gallery 001' },
      isShownBy: { thumbnail: 'https://www.example.eu/image.jpg' } }
  ]
};

const contentfulResponse = {
  data: {
    data: {
      themePageCollection: {
        items: [
          {
            identifier: 'art'
          }
        ]
      }
    }
  }
};
const contentfulQueryStub = sinon.stub();
contentfulQueryStub.resolves(contentfulResponse);

describe('components/browse/BrowseAutomatedCardGroup', () => {
  beforeAll(() => {
    sinon.stub(useContentfulGraphqlModule, 'useContentfulGraphql').returns({
      query: contentfulQueryStub
    });
  });
  afterEach(sinon.resetHistory);
  afterAll(sinon.restore);

  describe('fetch()', () => {
    describe('when section is cached', () => {
      const propsData = { sectionType: FEATURED_TOPICS };
      beforeEach(() => {
        $axiosGetStub.withArgs('/_api/cache/en/collections/topics/featured').resolves(
          { data: { 'en/collections/topics/featured': entries.featuredTopics } }
        );
      });
      afterEach(() => {
        $axiosGetStub.reset();
      });
      describe('when rendering on the client', () => {
        it('gets the data from the cache API endpoint', async() => {
          const wrapper = factory(propsData);
          await wrapper.vm.fetch();
          expect($axiosGetStub.calledWith('/_api/cache/en/collections/topics/featured')).toBe(true);
          expect(wrapper.vm.entries).toEqual(entries.featuredTopics);
        });
      });
    });

    describe('when the section is from Contentful', () => {
      const propsData = { sectionType: FEATURED_THEMES };

      it('fetches from Contentful and stores response items in entries', async() => {
        const wrapper = factory(propsData);

        await wrapper.vm.fetch();

        expect(contentfulQueryStub.calledWith(sinon.match.object, { locale: 'en-GB', preview: false })).toBe(true);
        expect(wrapper.vm.entries).toEqual(contentfulResponse.data.data.themePageCollection.items);
      });
    });

    describe('when the section is from the set API', () => {
      const propsData = { sectionType: LATEST_GALLERIES };
      const setResponse = {
        items: [
          {
            id: 'http://data.europeana.eu/set/1',
            title: { en: 'gallery I' },
            items: [
              {
                identifier: 'item ID'
              }
            ]
          },
          {
            id: 'http://data.europeana.eu/set/2',
            title: { en: 'gallery II' },
            items: [
              {
                identifier: 'item ID'
              }
            ]
          },
          {
            id: 'http://data.europeana.eu/set/3',
            title: { en: 'gallery III' },
            items: [
              {
                identifier: 'item ID'
              }
            ]
          },
          {
            id: 'http://data.europeana.eu/set/4',
            title: { en: 'gallery IV' },
            items: [
              {
                identifier: 'item ID'
              }
            ]
          }
        ]
      };

      it('fetches from the set API  and stores response items in entries', async() => {
        const wrapper = factory(propsData);
        wrapper.vm.$apis.set.search.resolves(setResponse);

        await wrapper.vm.fetch();

        expect(wrapper.vm.$apis.set.search.calledWith(
          {
            query: 'visibility:published',
            pageSize: 4,
            profile: 'items.meta',
            qf: 'lang:en'
          }
        )).toBe(true);
        expect(wrapper.vm.entries).toEqual(setResponse.items);
      });
    });

    describe('when the section is for trending items section', () => {
      const propsData = { sectionType: TRENDING_ITEMS };

      it('does not fetch entries', async() => {
        const wrapper = factory(propsData);

        await wrapper.vm.fetch();

        expect(wrapper.vm.trending).toEqual(true);
        expect(wrapper.vm.entries).toEqual([]);
      });
    });
  });

  describe('contentCardSection()', () => {
    describe('when the type is item counts by media type', () => {
      it('includes type', () => {
        const wrapper = factory({ sectionType: ITEM_COUNTS_MEDIA_TYPE });

        expect(wrapper.vm.contentCardSection.type).toBe('items/type-counts');
      });

      it('sets the relevant fields for the items in the hasPartCollection', async() => {
        const expected = {
          __typename: 'InfoCard',
          url: { name: 'search', query: { qf: 'TYPE:"IMAGE"', query: '' } },
          info: '100',
          label: 'facets.TYPE.options.IMAGE',
          image: 'ic-image'
        };

        const wrapper = factory({ sectionType: ITEM_COUNTS_MEDIA_TYPE });

        await wrapper.setData({
          entries: entries.itemTypeCounts
        });
        const section = wrapper.vm.contentCardSection;
        expect(section.hasPartCollection.items[0]).toEqual(expected);
        expect(section.hasPartCollection.items.length).toBe(5);
      });
    });
    describe('when the type is featured organisations', () => {
      it('includes a headline', () => {
        const wrapper = factory({ sectionType: FEATURED_ORGANISATIONS });

        expect(wrapper.vm.contentCardSection.headline).toBe('automatedCardGroup.organisation');
      });
      it('sets the relevant fields for the items in the hasPartCollection', async() => {
        const expected = {
          __typename: 'AutomatedEntityCard',
          __variant: 'mini',
          name: { en: 'organisation one' },
          identifier: 'http://data.europeana.eu/organization/1',
          image: 'image URL',
          logo: true,
          encoding: {
            id: 'http://data.europeana.eu/organization/1',
            logo: { id: 'http://commons.wikimedia.org/wiki/Special:FilePath/logo.jpg' },
            prefLabel: { en: 'organisation one' }
          }
        };

        const wrapper = factory({ sectionType: FEATURED_ORGANISATIONS });

        await wrapper.setData({
          entries: entries.featuredOrganisations
        });
        const section = wrapper.vm.contentCardSection;
        expect(section.hasPartCollection.items[0]).toEqual(expected);
        expect(section.hasPartCollection.items.length).toBe(4);
      });
    });
    describe('when the type is featured topics', () => {
      it('includes a headline', () => {
        const wrapper = factory({ sectionType: FEATURED_TOPICS });

        expect(wrapper.vm.contentCardSection.headline).toBe('automatedCardGroup.topic');
      });
      it('sets the relevant fields for the items in the hasPartCollection', async() => {
        const expected = {
          __typename: 'AutomatedEntityCard',
          __variant: 'mini',
          name: { en: 'topic one' },
          identifier: 'http://data.europeana.eu/concept/1',
          image: 'image URL',
          encoding: {
            id: 'http://data.europeana.eu/concept/1',
            isShownBy: {
              thumbnail: 'thumbnail'
            },
            prefLabel: { en: 'topic one' }
          },
          logo: false
        };

        const wrapper = factory({ sectionType: FEATURED_TOPICS });

        await wrapper.setData({
          entries: entries.featuredTopics
        });
        const section = wrapper.vm.contentCardSection;
        expect(section.hasPartCollection.items[0]).toEqual(expected);
        expect(section.hasPartCollection.items.length).toBe(4);
      });
    });
    describe('when the type is featured times', () => {
      it('includes a headline', () => {
        const wrapper = factory({ sectionType: FEATURED_TIMES });

        expect(wrapper.vm.contentCardSection.headline).toBe('automatedCardGroup.time');
      });
      it('sets the relevant fields for the items in the hasPartCollection', async() => {
        const expected = {
          __typename: 'AutomatedEntityCard',
          __variant: 'mini',
          name: { en: 'time one' },
          identifier: 'http://data.europeana.eu/timespan/1',
          image: 'image URL',
          encoding: {
            id: 'http://data.europeana.eu/timespan/1',
            isShownBy: {
              thumbnail: 'thumbnail'
            },
            prefLabel: { en: 'time one' }
          },
          logo: false
        };

        const wrapper = factory({ sectionType: FEATURED_TIMES });

        await wrapper.setData({
          entries: entries.featuredTimes
        });
        const section = wrapper.vm.contentCardSection;
        expect(section.hasPartCollection.items[0]).toEqual(expected);
        expect(section.hasPartCollection.items.length).toBe(4);
      });
    });
    describe('when the type is recent items', () => {
      it('includes a headline', () => {
        const wrapper = factory({ sectionType: RECENT_ITEMS });

        expect(wrapper.vm.contentCardSection.headline).toBe('automatedCardGroup.item');
      });
      it('sets a more button', () => {
        const wrapper = factory({ sectionType: RECENT_ITEMS, moreButton: { 'url': '/search', 'text': 'Show all items' } });
        expect(wrapper.vm.contentCardSection.moreButton.text).toBe('Show all items');
        expect(wrapper.vm.contentCardSection.moreButton.url).toBe('/search');
      });
      it('sets the relevant fields for the items in the hasPartCollection', async() => {
        const expected = {
          __typename: 'AutomatedRecordCard',
          __variant: null,
          identifier: '/500/identifier_1',
          image: 'image URL',
          name: undefined,
          encoding: {
            edmIsShownBy: 'isShownBy URL',
            edmPreview: 'preview URL',
            id: '/500/identifier_1',
            title: 'item one'
          },
          logo: false
        };

        const wrapper = factory({ sectionType: RECENT_ITEMS });

        await wrapper.setData({
          entries: entries.recentItems
        });
        const section = wrapper.vm.contentCardSection;
        expect(section.hasPartCollection.items[0]).toEqual(expected);
        expect(section.hasPartCollection.items.length).toBe(1);
      });
    });

    describe('when the type is latest galleries', () => {
      it('includes a headline', () => {
        const wrapper = factory({ sectionType: LATEST_GALLERIES });

        expect(wrapper.vm.contentCardSection.headline).toBe('automatedCardGroup.gallery');
      });
      it('sets a more button', () => {
        const wrapper = factory({ sectionType: LATEST_GALLERIES, moreButton: { 'url': '/search', 'text': 'Show all galleries' } });
        expect(wrapper.vm.contentCardSection.moreButton.text).toBe('Show all galleries');
      });
      it('sets the relevant fields for the galleries in the hasPartCollection', async() => {
        const expected = {
          __typename: 'AutomatedGalleryCard',
          __variant: null,
          identifier: '001',
          image: 'https://www.example.eu/image.jpg',
          name: { en: 'gallery 001' },
          url: 'galleries/001-gallery-001',
          description: undefined
        };

        const wrapper = factory({ sectionType: LATEST_GALLERIES });

        await wrapper.setData({
          entries: entries.latestGalleries
        });
        const section = wrapper.vm.contentCardSection;
        expect(section.hasPartCollection.items[0]).toEqual(expected);
        expect(section.hasPartCollection.items.length).toBe(1);
      });
    });
  });

  describe('imageFromType()', () => {
    it('prefixes the type with "ic-" for the icon class', () => {
      const wrapper = factory({ sectionType: ITEM_COUNTS_MEDIA_TYPE });
      const imageFromType = wrapper.vm.infoImageFromType('Type');
      expect(imageFromType).toBe('ic-type');
    });
  });
  describe('searchFromType()', () => {
    it('returns router params for a search for the relevant type', () => {
      const expected = {
        name: 'search',
        query: { query: '', qf: 'TYPE:"IMAGE"' }
      };
      const wrapper = factory({ sectionType: ITEM_COUNTS_MEDIA_TYPE });
      const searchFromType = wrapper.vm.searchFromType('IMAGE');
      expect(searchFromType).toEqual(expected);
    });
  });
});
