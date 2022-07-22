import { createLocalVue } from '@vue/test-utils';
import { mountNuxt } from '../../utils';
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

const factory = ({ propsData } = {}) => {
  return mountNuxt(ItemPreviewCardGroup, {
    localVue,
    propsData,
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
        },
        thumbnail: {
          edmPreview: () => '',
          generic: (id) => id
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
  afterEach(sinon.resetHistory);

  describe('template', () => {
    describe('when view is grid', () => {
      it('renders each result with a link, and resizes the masonary grid', async() => {
        const wrapper = factory({ propsData: { items: results, view: 'grid' } });
        await wrapper.vm.fetch();

        const renderedResults =  wrapper.findAll('[data-qa="item preview"]');

        expect(renderedResults.at(0).find('a').attributes().href.endsWith(`/item${results[0].id}`)).toBe(true);
        expect(renderedResults.at(1).find('a').attributes().href.endsWith(`/item${results[1].id}`)).toBe(true);
        expect(redrawMasonry.called).toBe(true);
      });
    });

    describe('when view is mosaic', () => {
      it('renders each result with a link, and resizes the masonary grid', async() => {
        const wrapper = factory({ propsData: { items: results, view: 'mosaic' } });
        await wrapper.vm.fetch();

        const renderedResults =  wrapper.findAll('[data-qa="item preview"]');

        expect(renderedResults.at(0).find('a').attributes().href.endsWith(`/item${results[0].id}`)).toBe(true);
        expect(renderedResults.at(1).find('a').attributes().href.endsWith(`/item${results[1].id}`)).toBe(true);
        expect(redrawMasonry.called).toBe(true);
      });
    });

    describe('when view is list', () => {
      it('renders each result with a link', async() => {
        const wrapper = factory({ propsData: { items: results, view: 'list' } });
        await wrapper.vm.fetch();

        const renderedResults =  wrapper.findAll('div[data-qa="item preview"]');

        expect(renderedResults.at(0).find('a').attributes().href.endsWith(`/item${results[0].id}`)).toBe(true);
        expect(renderedResults.at(1).find('a').attributes().href.endsWith(`/item${results[1].id}`)).toBe(true);
      });
    });
  });

  describe('fetch', () => {
    it('initialises cards to items, plus related at index 4', () => {
      const items = [
        { id: '1' },
        { id: '2' },
        { id: '3' },
        { id: '4' },
        { id: '5' }
      ];
      const wrapper = factory({ propsData: { items } });

      wrapper.vm.fetch();

      const expected = [
        { id: '1' },
        { id: '2' },
        { id: '3' },
        { id: '4' },
        'related',
        { id: '5' }
      ];
      expect(wrapper.vm.cards).toEqual(expected);
    });
  });

  describe('computed', () => {
    describe('cardGroupClass', () => {
      describe('when in list view', () => {
        it('uses the list card-group class', () => {
          const wrapper = factory({ propsData: { items: results, view: 'list' } });
          wrapper.vm.fetch();

          expect(wrapper.vm.cardGroupClass).toMatch('card-group-list');
        });
      });

      describe('when in explore view', () => {
        it('uses the explore-more card-group class', () => {
          const wrapper = factory({ propsData: { items: results, view: 'explore' } });
          wrapper.vm.fetch();

          expect(wrapper.vm.cardGroupClass).toMatch('explore-more');
        });
      });
    });
  });

  describe('watch', () => {
    describe('items', () => {
      it('triggers $fetch', async() => {
        const wrapper = factory({ propsData: { items: [{ id: '1' }] } });
        wrapper.vm.fetch();
        sinon.spy(wrapper.vm, '$fetch');

        await wrapper.setProps({ items: [{ id: '1' }, { id: '2' }] });

        expect(wrapper.vm.$fetch.called).toBe(true);
      });
    });
  });

  describe('methods', () => {
    describe('itemHitSelector', () => {
      describe('when no hits are present', () => {
        it('returns null', () => {
          const wrapper = factory();
          wrapper.vm.fetch();

          expect(wrapper.vm.itemHitSelector(results[0])).toBeNull();
        });
      });

      describe('when hits are present', () => {
        it('picks the hit with the same ID as the item', () => {
          const hitSelector = {
            field: 'rdf:value',
            prefix: 'Je^J)1-/ ',
            exact: 'Book',
            suffix: ' dito nuancé figuré &c. a. huitièmes fi? 6. quarts. 700. '
          };
          const wrapper = factory({ propsData: { items: results, view: 'list', hits: [{ scope: '/123/abc', selectors: [hitSelector] }] } });
          wrapper.vm.fetch();

          expect(wrapper.vm.itemHitSelector(results[0]).exact).toMatch(hitSelector.exact);
        });
      });
    });

    describe('endItemDrag', () => {
      it('emits an @endItemDrag event with item cards', () => {
        const wrapper = factory({ propsData: { items: results } });
        wrapper.vm.fetch();

        wrapper.vm.endItemDrag();

        expect(wrapper.emitted('endItemDrag')).toEqual([[results]]);
      });
    });
  });
});
