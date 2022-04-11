import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ItemPreviewCardGroup from '@/components/item/ItemPreviewCardGroup.vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.directive('masonry', {});
localVue.directive('masonry-tile', {});

const storeDispatch = sinon.spy();
const storeIsLikedGetter = sinon.stub();
const storeIsPinnedGetter = sinon.stub();
const redrawMasonry = sinon.spy();

const factory = () => {
  return mount(ItemPreviewCardGroup, {
    localVue,
    mocks: {
      $auth: { loggedIn: false },
      $config: { app: { internalLinkDomain: null } },
      $path: (opts) => `/item/${opts.params.pathMatch}`,
      $redrawVueMasonry: redrawMasonry,
      $i18n: {
        locale: 'en'
      },
      $t: () => {},
      $store: {
        state: {
          set: { ...{ liked: [] }, ...{} }
        },
        getters: {
          'set/isLiked': storeIsLikedGetter,
          'entity/isPinned': storeIsPinnedGetter
        },
        dispatch: storeDispatch
      },
      $apis: {
        record: {
          mediaProxyUrl: () => 'proxied'
        }
      }
    }
  });
};

const results = [
  {
    id: '/123/abc',
    dcTitleLangAware: { def: ['Record 123/abc'] },
    edmPreview: ['https://www.example.org/abc.jpg'],
    dataProvider: ['Provider 123']
  },
  {
    id: '/123/def',
    dcTitleLangAware: { def: ['Record 123/def'] },
    edmPreview: ['https://www.example.org/def.jpg'],
    dataProvider: ['Provider 123']
  }
];

describe('components/item/ItemPreviewCardGroup', () => {
  describe('when view is grid', () => {
    it('renders each result with a link, and resizes the masonary grid', async() => {
      const wrapper = factory();

      await wrapper.setProps({ items: results, view: 'grid' });

      const renderedResults =  wrapper.findAll('[data-qa="item preview"]');

      expect(renderedResults.at(0).find('a').attributes().href.endsWith(`/item${results[0].id}`)).toBe(true);
      expect(renderedResults.at(1).find('a').attributes().href.endsWith(`/item${results[1].id}`)).toBe(true);
      expect(redrawMasonry.called).toBe(true);
    });
  });

  describe('when view is mosaic', () => {
    it('renders each result with a link, and resizes the masonary grid', async() => {
      const wrapper = factory();

      await wrapper.setProps({ items: results, view: 'mosaic' });

      const renderedResults =  wrapper.findAll('[data-qa="item preview"]');

      expect(renderedResults.at(0).find('a').attributes().href.endsWith(`/item${results[0].id}`)).toBe(true);
      expect(renderedResults.at(1).find('a').attributes().href.endsWith(`/item${results[1].id}`)).toBe(true);
      expect(redrawMasonry.called).toBe(true);
    });
  });

  describe('when view is list', () => {
    it('renders each result with a link', async() => {
      const wrapper = factory();

      await wrapper.setProps({ items: results, view: 'list' });

      const renderedResults =  wrapper.findAll('div[data-qa="item preview"]');

      expect(renderedResults.at(0).find('a').attributes().href.endsWith(`/item${results[0].id}`)).toBe(true);
      expect(renderedResults.at(1).find('a').attributes().href.endsWith(`/item${results[1].id}`)).toBe(true);
    });
  });

  describe('cardGroupClass', () => {
    describe('when in list view', () => {
      it('uses the list card-group class', async() => {
        const wrapper = factory();

        await wrapper.setProps({ items: results, view: 'list' });

        expect(wrapper.vm.cardGroupClass).toMatch('card-group-list');
      });
    });

    describe('when in plain view', () => {
      it('uses the card-deck card-group class', async() => {
        const wrapper = factory();

        await wrapper.setProps({ items: results, view: 'plain' });

        expect(wrapper.vm.cardGroupClass).toMatch('card-deck-search');
      });
    });

    describe('when in explore view', () => {
      it('uses the explore-more card-group class', async() => {
        const wrapper = factory();

        await wrapper.setProps({ items: results, view: 'explore' });

        expect(wrapper.vm.cardGroupClass).toMatch('explore-more');
      });
    });

    describe('when in similar view', () => {
      it('uses the explore-more card-group class', async() => {
        const wrapper = factory();

        await wrapper.setProps({ items: results, view: 'similar' });

        expect(wrapper.vm.cardGroupClass).toMatch('similar-items');
      });
    });
  });

  describe('#itemHitSelector', () => {
    describe('when no hits are present', () => {
      it('returns null', () => {
        const wrapper = factory();

        expect(wrapper.vm.itemHitSelector(results[0])).toBeNull();
      });
    });
    describe('when hits are present', () => {
      it('picks the hit with the same ID as the item', async() => {
        const wrapper = factory();

        await wrapper.setProps({ items: results, view: 'list', hits: [{ scope: '/123/abc', selectors: ['example selector'] }] });

        expect(wrapper.vm.itemHitSelector(results[0])).toMatch('example selector');
      });
    });
  });
});
