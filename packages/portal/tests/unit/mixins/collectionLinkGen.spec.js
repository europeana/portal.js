import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../utils';

import mixin from '@/mixins/collectionLinkGen';

const component = {
  template: '<div></div>',
  mixins: [mixin]
};

const localVue = createLocalVue();

const collections = [
  {
    id: 'http://data.europeana.eu/agent/123',
    prefLabel: {
      de: 'Contentful title',
      en: 'Contentful title EN'
    },
    image: 'http://data.europeana.eu/item/123/ABC'
  },
  {
    id: 'http://data.europeana.eu/concept/194',
    prefLabel: {
      en: 'Visual arts'
    },
    isShownBy: {
      id: 'item2isShownById',
      source: 'http://data.europeana.eu/item/123/XYZ',
      thumbnail: 'thumbnailUrlItem2',
      type: 'WebResource'
    }
  },
  {
    id: 'http://data.europeana.eu/organzation/1',
    logo: {
      id: 'http://www.wikimedia.org/wiki/Special:FilePath/logoUrlItem3.jpg',
      source: 'www.wikimedia.org/wiki/Special:FilePath/logoUrlItem3'
    },
    prefLabel: {
      en: 'Europeana'
    }
  },
  {
    id: 'http://data.europeana.eu/concept/55',
    prefLabel: {
      en: 'Textile'
    }
  }
];

const factory = () => shallowMountNuxt(component, {
  localVue
});

describe('mixins/collectionLinkGen', () => {
  describe('collectionLinkGen', () => {
    describe('when the item has an identifier/it is a curated chip from contenful', () => {
      it('uses the identifier and english name for the slug', () => {
        const wrapper = factory();
        expect(wrapper.vm.collectionLinkGen(collections[0])).toEqual({
          name: 'collections-type-all', params: { pathMatch: '123-contentful-title-en', type: 'person' }
        });
      });
    });

    describe('when the item has an id/it is a Europeana entity from a search request', () => {
      it('uses the id and the English prefLabel for the name', () => {
        const wrapper = factory();
        expect(wrapper.vm.collectionLinkGen(collections[1])).toEqual({
          name: 'collections-type-all', params: { pathMatch: '194-visual-arts', type: 'topic' }
        });
      });
    });

    describe('when the item can not be identified as a Europeana entity', () => {
      it('is `null`', () => {
        const wrapper = factory();
        expect(wrapper.vm.collectionLinkGen({})).toBe(null);
      });
    });
  });
});
