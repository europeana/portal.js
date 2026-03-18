import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';
import sinon from 'sinon';

import SetCardGroup from '@/components/set/SetCardGroup.vue';

const localVue = createLocalVue();

const setId = '1234';

const setUris = [`http://data.europeana.eu/set/${setId}`];

const fetchedSetsV1 = [
  {
    id: setId,
    type: 'Collection',
    visibility: 'published',
    title: { en: 'A new collection' },
    description: 'A description',
    items: [
      {
        edmPreview: ['http://www.example.org/edmPreview.jpg']
      }
    ],
    total: 1
  }
];
const parsedFetchedSetsV1 = [
  {
    description: 'A description',
    title: { en: 'A new collection' },
    slug: '1234-a-new-collection',
    thumbnail: 'http://www.example.org/edmPreview.jpg'
  }
];

const fetchedSets = [
  {
    id: setId,
    type: 'Collection',
    visibility: 'published',
    title: { en: 'A new collection' },
    description: 'A description',
    isShownBy: {
      thumbnail: 'http://www.example.org/isShownBy.jpg'
    },
    total: 1
  }
];
const parsedFetchedSets = [
  {
    description: 'A description',
    title: { en: 'A new collection' },
    slug: '1234-a-new-collection',
    thumbnail: 'http://www.example.org/isShownBy.jpg'
  }
];

const factory = ({ propsData } = {}) => {
  return shallowMountNuxt(SetCardGroup, {
    localVue,
    propsData: {
      title: 'title value',
      ...propsData
    },
    mocks: {
      $apis: {
        set: { search: sinon.stub().resolves({ items: fetchedSets }) },
        thumbnail: { edmPreview: (img) => [].concat(img)[0] }
      },
      $i18n: { locale: 'en' }
    },
    stubs: ['b-card-group', 'ContentCard']
  });
};

describe('components/related/SetCardGroup', () => {
  describe('fetch', () => {
    describe('and no entity URIs are supplied', () => {
      it('has no collections', async() => {
        const wrapper = factory();

        await wrapper.vm.fetch();

        expect(wrapper.vm.sets).toEqual([]);
      });
    });

    describe('when set URIs are supplied', () => {
      it('fetches sets from set API filtered by UI language', async() => {
        const wrapper = factory({ propsData: { setUris } });

        await wrapper.vm.fetch();

        expect(wrapper.vm.$apis.set.search.calledWith({ query: `set_id:${setId}`, qf: `lang:${wrapper.vm.$i18n.locale}`, profile: 'items.meta', page: 1 })).toBe(true);
      });
    });
  });

  describe('methods', () => {
    describe('Set API v1 compatibility', () => {
      describe('parseSets', () => {
        it('selects and formats the relevant fields', () => {
          const wrapper = factory({ propsData: { setUris } });
          wrapper.vm.$apis.set.search = sinon.stub().resolves({ items: fetchedSetsV1 });

          const parsedSets = wrapper.vm.parseSets(fetchedSetsV1);
          expect(parsedSets).toEqual(parsedFetchedSetsV1);
        });
      });

      describe('setPreviewUrl', () => {
        it('uses the thumbnail plugin with edmPreview', () => {
          const wrapper = factory({ propsData: { setUris } });
          wrapper.vm.$apis.set.search = sinon.stub().resolves({ items: fetchedSetsV1 });

          const previewUrl = wrapper.vm.setPreviewUrl(['https://example.org/edmPreview.jpg']);
          expect(previewUrl).toEqual('https://example.org/edmPreview.jpg');
        });
      });
    });

    describe('parseSets', () => {
      it('selects and formats the relevant fields', () => {
        const wrapper = factory({ propsData: { setUris } });

        const parsedSets = wrapper.vm.parseSets(fetchedSets);
        expect(parsedSets).toEqual(parsedFetchedSets);
      });
    });

    describe('setPreviewUrl', () => {
      it('uses the thumbnail plugin with isShownBy thumbnail', () => {
        const wrapper = factory({ propsData: { setUris } });

        const previewUrl = wrapper.vm.setPreviewUrl(['https://example.org/edmPreview.jpg']);
        expect(previewUrl).toEqual('https://example.org/edmPreview.jpg');
      });
    });
  });
});
