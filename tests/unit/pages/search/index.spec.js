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
const searchSetShowFiltersToggle = sinon.spy();
const searchSet = sinon.spy();
const setShowSearchBar = sinon.spy();

const store = new Vuex.Store({
  state: {
    search: {
      overrideParams: {
        query: {}
      },
      showFiltersToggle: false
    }
  },
  mutations: {
    'search/enableCollectionFacet': searchEnableCollectionFacet,
    'search/setShowFiltersToggle': searchSetShowFiltersToggle,
    'search/set': searchSet,
    'search/setShowSearchBar': (state, value) => setShowSearchBar(value)
  },
  getters: {
    'search/showFiltersSheet': () => () => false,
    'search/collection': () => () => false,
    'search/filters': () => () => false
  }
});

const factory = (query) => shallowMountNuxt(page, {
  localVue,
  stubs: ['client-only'],
  mocks: {
    $features: {},
    $pageHeadTitle: key => key,
    $route: {
      query: {
        query
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
  afterEach(() => {
    sinon.resetHistory();
  });

  describe('fetch()', () => {
    it('resets overrideParams on the search store', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(searchSet.called).toBe(true);
    });
  });

  describe('methods', () => {
    describe('showRelatedSection()', () => {
      it('sets showRelated to true', async() => {
        const wrapper = factory();

        await wrapper.vm.showRelatedSection();

        expect(wrapper.vm.showRelated).toBe(true);
      });
    });

    describe('hideRelatedSection()', () => {
      it('sets showRelated to true', async() => {
        const wrapper = factory();

        await wrapper.vm.hideRelatedSection();

        expect(wrapper.vm.showRelated).toBe(false);
      });
    });
  });

  describe('head()', () => {
    describe('with no query', () => {
      it('is only "search"', async() => {
        const wrapper = factory();

        const headTitle = wrapper.vm.head().title;

        expect(headTitle).toBe('search');
      });
    });

    describe('with a query', () => {
      it('uses the search query in the title', async() => {
        const wrapper = factory('test');

        const headTitle = wrapper.vm.head().title;

        expect(headTitle).toBe('searchResultsFor test');
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
});
