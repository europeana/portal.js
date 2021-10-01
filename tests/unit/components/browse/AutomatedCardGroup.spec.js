import { createLocalVue, shallowMount } from '@vue/test-utils';
import { mountNuxt } from '../../utils';
import sinon from 'sinon';
import BootstrapVue from 'bootstrap-vue';

import AutomatedCardGroup from '@/components/browse/AutomatedCardGroup.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const FEATURED_TOPICS = 'Featured topics';
const FEATURED_TIMES = 'Featured centuries';
const RECENT_ITEMS = 'Recent items';
const ITEM_COUNTS_MEDIA_TYPE = 'Item counts by Media type';

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
  itemCountsMediaType: [
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
      $axiosGetStub.withArgs('/_api/entities/topics').resolves({ data: entries.featuredTopics });
    });
    afterEach(() => {
      $axiosGetStub.reset();
    });
    context('when rendering on the client', () => {
      it('uses gets the data from the cache API endpoint', async() => {
        const wrapper = nuxtFactory({ sectionType: FEATURED_TOPICS });
        await wrapper.vm.fetch();
        $axiosGetStub.should.have.been.calledWith('/_api/entities/topics');
        wrapper.vm.entries.should.deep.eq(entries.featuredTopics);
      });
    });
    // context('when rendering on the server', () => {
    // TODO: SET SERVER HERE AND STUB CACHE
    // it('uses gets the data from the cache', async() => {
    //   const wrapper = factory({ sectionType: 'Featured topics' });
    //   await wrapper.vm.fetch();
    //   wrapper.vm.entries.should.eq(entries.featuredTopics);
    // });
    // });
  });

  describe('contentCardSection()', () => {
    context('when the type is item counts by media type', () => {
      it('includes type', () => {
        const wrapper = shallowFactory({ sectionType: ITEM_COUNTS_MEDIA_TYPE });

        wrapper.vm.contentCardSection.type.should.eq('itemCountsMediaType');
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
          entries: entries.itemCountsMediaType
        });
        const section = wrapper.vm.contentCardSection;
        section.hasPartCollection.items[0].should.deep.eq(expected);
        section.hasPartCollection.items.length.should.eq(5);
      });
    });
    context('when the type is featured topics', () => {
      it('includes a headline', () => {
        const wrapper = shallowFactory({ sectionType: FEATURED_TOPICS });

        wrapper.vm.contentCardSection.headline.should.eq('automatedCardGroup.topic');
      });
      it('sets the relevant fields for the items in the hasPartCollection', async() => {
        const expected = {
          __typename: 'AutomatedEntityCard',
          name: { en: 'topic one' },
          identifier: 'http://data.europeana.eu/concept/base/1',
          image: 'thumbnail',
          encoding: {
            id: 'http://data.europeana.eu/concept/base/1',
            isShownBy: {
              thumbnail: 'thumbnail'
            },
            prefLabel: { en: 'topic one' }
          }
        };

        const wrapper = shallowFactory({ sectionType: FEATURED_TOPICS });

        await wrapper.setData({
          entries: entries.featuredTopics
        });
        const section = wrapper.vm.contentCardSection;
        section.hasPartCollection.items[0].should.deep.eq(expected);
        section.hasPartCollection.items.length.should.eq(4);
      });
    });
    context('when the type is featured times', () => {
      it('includes a headline', () => {
        const wrapper = shallowFactory({ sectionType: FEATURED_TIMES });

        wrapper.vm.contentCardSection.headline.should.eq('automatedCardGroup.time');
      });
      it('sets the relevant fields for the items in the hasPartCollection', async() => {
        const expected = {
          __typename: 'AutomatedEntityCard',
          name: { en: 'time one' },
          identifier: 'http://data.europeana.eu/timespan/1',
          image: 'thumbnail',
          encoding: {
            id: 'http://data.europeana.eu/timespan/1',
            isShownBy: {
              thumbnail: 'thumbnail'
            },
            prefLabel: { en: 'time one' }
          }
        };

        const wrapper = shallowFactory({ sectionType: FEATURED_TIMES });

        await wrapper.setData({
          entries: entries.featuredTimes
        });
        const section = wrapper.vm.contentCardSection;
        section.hasPartCollection.items[0].should.deep.eq(expected);
        section.hasPartCollection.items.length.should.eq(4);
      });
    });
    context('when the type is recent items', () => {
      it('includes a headline', () => {
        const wrapper = shallowFactory({ sectionType: RECENT_ITEMS });

        wrapper.vm.contentCardSection.headline.should.eq('automatedCardGroup.item');
      });
      it('sets the relevant fields for the items in the hasPartCollection', async() => {
        const expected = {
          __typename: 'AutomatedRecordCard',
          identifier: '/500/identifier_1',
          image: undefined,
          name: undefined,
          encoding: {
            edmIsShownBy: 'isShownBy URL',
            edmPreview: 'preview URL',
            id: '/500/identifier_1',
            title: 'item one'
          }
        };

        const wrapper = shallowFactory({ sectionType: RECENT_ITEMS });

        await wrapper.setData({
          entries: entries.recentItems
        });
        const section = wrapper.vm.contentCardSection;
        section.hasPartCollection.items[0].should.deep.eq(expected);
        section.hasPartCollection.items.length.should.eq(1);
      });
    });
  });

  describe('imageFromType()', () => {
    it('prefixes the type with "ic-" for the icon class', () => {
      const wrapper = shallowFactory({ sectionType: ITEM_COUNTS_MEDIA_TYPE });
      const imageFromType = wrapper.vm.infoImageFromType('Type');
      imageFromType.should.eq('ic-type');
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
      searchFromType.should.deep.eq(expected);
    });
  });
});
