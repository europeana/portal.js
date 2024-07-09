import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n';
import BootstrapVue from 'bootstrap-vue';

import sinon from 'sinon';

import page from '@/pages/search/index';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);
localVue.use(VueI18n);

const searchEnableCollectionFacet = sinon.spy();
const searchSetShowSidebarToggle = sinon.spy();
const searchSet = sinon.spy();
const setShowSearchBar = sinon.spy();

const store = new Vuex.Store({
  state: {
    search: {
      overrideParams: {
        query: {}
      },
      showSidebarToggle: false
    }
  },
  mutations: {
    'search/enableCollectionFacet': searchEnableCollectionFacet,
    'search/setShowSidebarToggle': searchSetShowSidebarToggle,
    'search/set': searchSet,
    'search/setShowSearchBar': (state, value) => setShowSearchBar(value)
  },
  getters: {
    'search/showSearchSidebar': () => () => false,
    'search/collection': () => () => false,
    'search/filters': () => () => false
  }
});

const factory = (options = {}) => shallowMountNuxt(page, {
  localVue,
  i18n: new VueI18n({ locale: 'en' }),
  stubs: {
    'SearchInterface': {
      template: '<div><slot name="related-galleries" /><slot name="related-collections" /><slot name="after-results" /></div>'
    },
    RelatedCollectionsCard: true
  },
  mocks: {
    $features: {},
    $route: {
      query: {
        query: options.query,
        sort: options.sort
      }
    },
    $fetchState: {},
    $t: (key, args) => args ? `${key} ${args}` : key,
    $auth: {
      loggedIn: false
    },
    $apis: {
      annotation: {
        search: sinon.spy()
      },
      entity: {
        find: sinon.spy()
      },
      record: {
        getRecord: sinon.stub().resolves({}),
        search: sinon.spy()
      }
    }
  },
  store
});

describe('pages/item/_.vue', () => {
  afterEach(sinon.resetHistory);

  describe('pageMeta', () => {
    describe('with no query', () => {
      it('is only "search"', async() => {
        const wrapper = factory();

        const headTitle = wrapper.vm.pageMeta.title;

        expect(headTitle).toBe('search.title');
      });
    });

    describe('with a query', () => {
      it('uses the search query in the title', async() => {
        const wrapper = factory({ query: 'test' });

        const headTitle = wrapper.vm.pageMeta.title;

        expect(headTitle).toBe('searchResultsFor test');
      });
    });
  });

  describe('searchOverrides', () => {
    describe('when performing a blank search', () => {
      it('includes the random sorting params', async() => {
        const wrapper = factory();

        const searchOverrides = wrapper.vm.searchOverrides;

        expect(searchOverrides.sort).toBe('score desc,contentTier desc,random_europeana asc,timestamp_update desc,europeana_id asc');
      });
    });

    describe('when there is an active query', () => {
      it('does NOT include random sorting', () => {
        const wrapper = factory({ query: 'something' });

        const searchOverrides = wrapper.vm.searchOverrides;

        expect(searchOverrides.sort).toBe(undefined);
      });
    });

    describe('when there is a custom sort provided', () => {
      it('does NOT include random sorting', async() => {
        const wrapper = factory({ sort: 'score desc' });

        const searchOverrides = wrapper.vm.searchOverrides;

        expect(searchOverrides.sort).toBe(undefined);
      });
    });
  });

  describe('beforeRouteLeave', () => {
    it('hides search bar', async() => {
      const to = { name: 'item___eu', fullPath: '/eu/item/123', matched: [{ path: '/eu/item/123' }] };
      const wrapper = factory();

      const next = sinon.stub();

      await wrapper.vm.$options.beforeRouteLeave.call(wrapper.vm, to, null, next);

      expect(setShowSearchBar.calledWith(false)).toBe(true);
      expect(next.called).toBe(true);
    });
  });

  describe('watch', () => {
    describe('searchQuery', () => {
      it('resets the related collections to `null`', async() => {
        const wrapper = factory({ query: 'fish' });
        await wrapper.setData({
          relatedCollections: [{ id: 'http://data.europeana.eu/concept/3012' }]
        });

        wrapper.vm.$route.query = 'frank';

        await wrapper.vm.$nextTick();
        expect(wrapper.vm.relatedCollections).toBe(null);
      });
    });
  });

  describe('methods', () => {
    describe('handleRelatedCollectionsCardFetched', () => {
      it('is triggered by relatedFetched event on related collections component', () => {
        const wrapper = factory({ query: 'fish' });
        const relatedCollections = [{ id: 'http://data.europeana.eu/concept/3012' }];

        const relatedCollectionsCardComponent = wrapper.find('[data-qa="related collections"]');
        relatedCollectionsCardComponent.vm.$emit('relatedFetched', relatedCollections);

        expect(wrapper.vm.relatedCollections).toEqual(relatedCollections);
      });
    });

    describe('handleRelatedGalleriesFetched', () => {
      it('is triggered by fetched event on related galleries component', () => {
        const wrapper = factory({ query: 'fish' });
        const relatedGalleries = [{ slug: '001-fish' }];

        const relatedGalleriesComponent = wrapper.find('[data-qa="related galleries"]');
        relatedGalleriesComponent.vm.$emit('fetched', relatedGalleries);

        expect(wrapper.vm.relatedGalleries).toEqual(relatedGalleries);
      });
    });
  });
});
