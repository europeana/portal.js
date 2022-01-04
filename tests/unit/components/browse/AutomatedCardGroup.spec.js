import { createLocalVue, shallowMount } from '@vue/test-utils';
import { mountNuxt } from '../../utils';
import sinon from 'sinon';
import BootstrapVue from 'bootstrap-vue';

import AutomatedCardGroup from '@/components/browse/AutomatedCardGroup.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const FEATURED_ORGANISATIONS = 'Featured organisations';
const FEATURED_TOPICS = 'Featured topics';
const FEATURED_TIMES = 'Featured centuries';
const RECENT_ITEMS = 'Recent items';
const ITEM_COUNTS_MEDIA_TYPE = 'Item counts by media type';

const $axiosGetStub = sinon.stub();

const nuxtFactory = (props = { sectionType: FEATURED_TOPICS })  => mountNuxt(AutomatedCardGroup, {
  localVue,
  propsData: props,
  mocks: {
    $fetchState: {
      error: false,
      pending: false
    },
    $path: () => 'mocked path',
    $i18n: { locale: 'en', t: () => {} },
    $axios: {
      get: $axiosGetStub
    },
    $config: { app: { internalLinkDomain: 'https://europeana.eu' } },
    $t: () => {}
  }
});

const shallowFactory = (props = { sectionType: FEATURED_TOPICS })  => shallowMount(AutomatedCardGroup, {
  localVue,
  propsData: props,
  mocks: {
    $fetchState: {
      error: false,
      pending: false
    },
    $path: (opts) => opts,
    $i18n: { locale: 'en', t: (input) => {
      return input;
    }, n: (input) => {
      return `${input}`;
    } },
    $axios: {
      get: $axiosGetStub
    },
    $t: (input) => input
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
      id: 'http://data.europeana.eu/concept/base/1',
      prefLabel: { en: 'topic one' },
      isShownBy: { thumbnail: 'thumbnail' }
    },
    {
      id: 'http://data.europeana.eu/concept/base/2',
      prefLabel: { en: 'topic two' }
    },
    {
      id: 'http://data.europeana.eu/concept/base/3',
      prefLabel: { en: 'topic three' }
    },
    {
      id: 'http://data.europeana.eu/concept/base/4',
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
  ]
};

describe('components/browse/AutomatedCardGroup', () => {
  describe('fetch()', () => {
    beforeEach(() => {
      $axiosGetStub.withArgs('/_api/cache/en/collections/topics/featured').resolves({ data: entries.featuredTopics });
    });
    afterEach(() => {
      $axiosGetStub.reset();
    });
    describe('when rendering on the client', () => {
      it('gets the data from the cache API endpoint', async() => {
        const wrapper = nuxtFactory({ sectionType: FEATURED_TOPICS });
        await wrapper.vm.fetch();
        expect($axiosGetStub.calledWith('/_api/cache/en/collections/topics/featured'));
        expect(wrapper.vm.entries).toEqual(entries.featuredTopics);
      });
    });
    // describe('when rendering on the server', () => {
    // TODO: SET SERVER HERE AND STUB CACHE
    // it('gets the data from the cache', async() => {
    //   const wrapper = factory({ sectionType: 'Featured topics' });
    //   await wrapper.vm.fetch();
    //   expect(wrapper.vm.entries).toBe(entries.featuredTopics);
    // });
    // });
  });

  describe('contentCardSection()', () => {
    describe('when the type is item counts by media type', () => {
      it('includes type', () => {
        const wrapper = shallowFactory({ sectionType: ITEM_COUNTS_MEDIA_TYPE });

        expect(wrapper.vm.contentCardSection.type).toBe('items/typeCounts');
      });
      it('sets the relevant fields for the items in the hasPartCollection', async() => {
        const expected = {
          __typename: 'InfoCard',
          url: { name: 'search', query: { qf: 'TYPE:"IMAGE"', query: '' } },
          info: '100',
          label: 'facets.TYPE.options.IMAGE',
          image: 'ic-image'
        };

        const wrapper = shallowFactory({ sectionType: ITEM_COUNTS_MEDIA_TYPE });

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
        const wrapper = shallowFactory({ sectionType: FEATURED_ORGANISATIONS });

        expect(wrapper.vm.contentCardSection.headline).toBe('automatedCardGroup.organisation');
      });
      it('sets the relevant fields for the items in the hasPartCollection', async() => {
        const expected = {
          __typename: 'AutomatedEntityCard',
          __variant: 'mini',
          name: { en: 'organisation one' },
          identifier: 'http://data.europeana.eu/organization/1',
          image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/logo.jpg/80px-logo.jpg',
          logo: true,
          encoding: {
            id: 'http://data.europeana.eu/organization/1',
            logo: { id: 'http://commons.wikimedia.org/wiki/Special:FilePath/logo.jpg' },
            prefLabel: { en: 'organisation one' }
          }
        };

        const wrapper = shallowFactory({ sectionType: FEATURED_ORGANISATIONS });

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
        const wrapper = shallowFactory({ sectionType: FEATURED_TOPICS });

        expect(wrapper.vm.contentCardSection.headline).toBe('automatedCardGroup.topic');
      });
      it('sets the relevant fields for the items in the hasPartCollection', async() => {
        const expected = {
          __typename: 'AutomatedEntityCard',
          __variant: 'mini',
          name: { en: 'topic one' },
          identifier: 'http://data.europeana.eu/concept/base/1',
          image: 'thumbnail',
          encoding: {
            id: 'http://data.europeana.eu/concept/base/1',
            isShownBy: {
              thumbnail: 'thumbnail'
            },
            prefLabel: { en: 'topic one' }
          },
          logo: false
        };

        const wrapper = shallowFactory({ sectionType: FEATURED_TOPICS });

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
        const wrapper = shallowFactory({ sectionType: FEATURED_TIMES });

        expect(wrapper.vm.contentCardSection.headline).toBe('automatedCardGroup.time');
      });
      it('sets the relevant fields for the items in the hasPartCollection', async() => {
        const expected = {
          __typename: 'AutomatedEntityCard',
          __variant: 'mini',
          name: { en: 'time one' },
          identifier: 'http://data.europeana.eu/timespan/1',
          image: 'thumbnail',
          encoding: {
            id: 'http://data.europeana.eu/timespan/1',
            isShownBy: {
              thumbnail: 'thumbnail'
            },
            prefLabel: { en: 'time one' }
          },
          logo: false
        };

        const wrapper = shallowFactory({ sectionType: FEATURED_TIMES });

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
        const wrapper = shallowFactory({ sectionType: RECENT_ITEMS });

        expect(wrapper.vm.contentCardSection.headline).toBe('automatedCardGroup.item');
      });
      it('sets a more button', () => {
        const wrapper = shallowFactory({ sectionType: RECENT_ITEMS, moreButton: { 'url': '/search', 'text': 'Show all items' } });
        expect(wrapper.vm.contentCardSection.moreButton.text).toBe('Show all items');
        expect(wrapper.vm.contentCardSection.moreButton.url).toBe('/search');
      });
      it('sets the relevant fields for the items in the hasPartCollection', async() => {
        const expected = {
          __typename: 'AutomatedRecordCard',
          __variant: null,
          identifier: '/500/identifier_1',
          image: null,
          name: undefined,
          encoding: {
            edmIsShownBy: 'isShownBy URL',
            edmPreview: 'preview URL',
            id: '/500/identifier_1',
            title: 'item one'
          },
          logo: false
        };

        const wrapper = shallowFactory({ sectionType: RECENT_ITEMS });

        await wrapper.setData({
          entries: entries.recentItems
        });
        const section = wrapper.vm.contentCardSection;
        expect(section.hasPartCollection.items[0]).toEqual(expected);
        expect(section.hasPartCollection.items.length).toBe(1);
      });
    });
  });

  describe('imageFromType()', () => {
    it('prefixes the type with "ic-" for the icon class', () => {
      const wrapper = shallowFactory({ sectionType: ITEM_COUNTS_MEDIA_TYPE });
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
      const wrapper = shallowFactory({ sectionType: ITEM_COUNTS_MEDIA_TYPE });
      const searchFromType = wrapper.vm.searchFromType('IMAGE');
      expect(searchFromType).toEqual(expected);
    });
  });
});
