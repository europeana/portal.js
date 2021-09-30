import { createLocalVue, shallowMount } from '@vue/test-utils';

import AutomatedCardGroup from '@/components/browse/AutomatedCardGroup.vue';

const localVue = createLocalVue();
const FEATURED_TOPICS = 'Featured topics';
const FEATURED_TIMES = 'Featured centuries';
const RECENT_ITEMS = 'Recent items';
const ITEM_COUNTS_MEDIA_TYPE = 'Item counts by Media type';

const factory = (props = { sectionType: FEATURED_TOPICS }) => shallowMount(AutomatedCardGroup, {
  localVue,
  propsData: props,
  mocks: {
    module: {
      entriesOfTheDay: {}
    },
    $path: (opts) => opts,
    $i18n: { locale: 'en', $t: () => {} },
    $t: () => {}
  }
});

const entries = {
  featuredTopics: [],
  featuredTimes: [],
  recentItems: [],
  itemCountsMediaType: []
};

describe('components/browse/AutomatedCardGroup', () => {
  describe('fetch()', () => {
    context('when rendering on the server', () => {
      // SET SERVER HERE
      it('uses gets the data from the cache', () => {
        const wrapper = factory({ sectionType: 'Featured topics' });

        wrapper.vm.entries.should.eq(entries.featuredTopics);
      });
    });
    context('when rendering on the client', () => {
      // SET CLIENT HERE
      it('uses gets the data from the cache API endpoint', () => {
        const wrapper = factory({ sectionType: FEATURED_TOPICS });

        wrapper.vm.entries.should.eq(entries.featuredTopics);
      });
    });
  });

  describe('contentCardSection()', () => {
    context('when the type is item counts by media type', () => {
      it('includes type', () => {
        const wrapper = factory({ sectionType: ITEM_COUNTS_MEDIA_TYPE });

        wrapper.vm.contentCardSection.type.should.eq('itemCountsMediaType');
      });
      it('sets the relevant fields for the hasPartCorllection', () => {
        const expected = {
          items: [
            {
              __typename: cardType,
              url: searchURL,
              info: count,
              label: `facets.TYPE.options.${label}`,
              image: `ic-${label}`
            }
          ]
        };

        const wrapper = factory({ sectionType: ITEM_COUNTS_MEDIA_TYPE });

        wrapper.vm.contentCardSection.hasPartCollection.should.eq(expected);
      });
    });
    context('when the type is featured topics', () => {
      it('includes a headline', () => {
        const wrapper = factory({ sectionType: FEATURED_TOPICS });

        wrapper.vm.contentCardSection.headline.should.eq('headline');
      });
      it('sets the relevant fields for the hasPartCorllection', () => {
        const expected = {
          items: [
            {
              __typename: cardType,
              name: searchURL,
              identifier: count,
              image: `facets.TYPE.options.${label}`,
              encoding: `ic-${label}`
            }
          ]
        };

        const wrapper = factory({ sectionType: FEATURED_TOPICS });

        wrapper.vm.contentCardSection.hasPartCollection.should.eq(expected);
      });
    });
    context('when the type is featured times', () => {
      it('includes a headline', () => {
        const wrapper = factory({ sectionType: FEATURED_TIMES });

        wrapper.vm.contentCardSection.headline.should.eq('headline');
      });
      it('sets the relevant fields for the hasPartCorllection', () => {
        const expected = {
          items: [
            {
              __typename: cardType,
              name: searchURL,
              identifier: count,
              image: `facets.TYPE.options.${label}`,
              encoding: `ic-${label}`
            }
          ]
        };

        const wrapper = factory({ sectionType: FEATURED_TIMES });

        wrapper.vm.contentCardSection.hasPartCollection.should.eq(expected);
      });
    });
    context('when the type is recent items', () => {
      it('includes a headline', () => {
        const wrapper = factory({ sectionType: RECENT_ITEMS });

        wrapper.vm.contentCardSection.headline.should.eq('headline');
      });
      it('sets the relevant fields for the hasPartCorllection', () => {
        const expected = {
          items: [
            {
              __typename: cardType,
              name: searchURL,
              identifier: count,
              image: `facets.TYPE.options.${label}`,
              encoding: `ic-${label}`
            }
          ]
        };

        const wrapper = factory({ sectionType: RECENT_ITEMS });

        wrapper.vm.contentCardSection.hasPartCollection.should.eq(expected);
      });
    });
  });

  describe('imageFromType()', () => {
    it('prefixes the type with "ic-" for the icon class', () => {
      const wrapper = factory({ sectionType: ITEM_COUNTS_MEDIA_TYPE });
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
      const wrapper = factory({ sectionType: ITEM_COUNTS_MEDIA_TYPE });
      const searchFromType = wrapper.vm.searchFromType('IMAGE');
      searchFromType.should.eq(expected);
    });
  });
});
