import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';

import ItemPreviewInterface from '@/components/item/ItemPreviewInterface.vue';

const localVue = createLocalVue();

const factory = ({ mocks = {}, propsData = {} } = {}) => shallowMount(ItemPreviewInterface, {
  localVue,
  mocks: {
    $cookies: {
      set: sinon.spy()
    },
    $features: {},
    $n: (key) => key,
    $store: {
      commit: sinon.spy(),
      getters: {
        'search/activeView': 'grid'
      }
    },
    $route: { query: {} },
    $t: (key) => key,
    $tc: (key) => key,
    ...mocks
  },
  propsData,
  stubs: ['b-col', 'b-row', 'b-container']
});

describe('@/components/item/ItemPreviewInterface', () => {
  describe('view', () => {
    describe('setter', () => {
      it('commits to the search store', () => {
        const wrapper = factory();
        const view = 'list';

        wrapper.vm.view = view;

        expect(wrapper.vm.$store.commit.calledWith('search/setView', view)).toBe(true);
      });
    });
  });

  describe('noMoreItems', () => {
    describe('when there are 0 results in total', () => {
      const wrapper = factory({
        propsData: { total: 0 }
      });

      it('is `false`', () => {
        expect(wrapper.vm.noMoreItems).toBe(false);
      });
    });

    describe('when there are some results in total', () => {
      describe('and results here', () => {
        const wrapper = factory({
          propsData: {
            total: 100,
            items: [{}]
          }
        });

        it('is `false`', () => {
          expect(wrapper.vm.noMoreItems).toBe(false);
        });
      });

      describe('but no results here', () => {
        const wrapper = factory({
          propsData: {
            items: [],
            total: 100
          }
        });

        it('is `true`', () => {
          expect(wrapper.vm.noMoreItems).toBe(true);
        });
      });
    });
  });

  describe('setViewFromRouteQuery', () => {
    describe('with view in route query', () => {
      const route = { query: { view: 'mosaic', query: 'sport' } };

      it('updates the stored view', () => {
        const wrapper = factory({ mocks: { $route: route } });
        wrapper.setData({ view: 'list' });

        wrapper.vm.setViewFromRouteQuery();

        expect(wrapper.vm.$store.commit.calledWith('search/setView', 'mosaic')).toBe(true);
      });

      it('sets searchResultsView cookie', () => {
        const wrapper = factory({ mocks: { $route: route } });
        wrapper.setData({ view: 'list' });

        wrapper.vm.setViewFromRouteQuery();

        expect(wrapper.vm.$cookies.set.calledWith('searchResultsView', 'mosaic')).toBe(true);
      });
    });

    describe('without view in route query', () => {
      const route = { query: { query: 'sport' } };

      it('does not update the stored view', () => {
        const wrapper = factory({ mocks: { $route: route } });
        wrapper.setData({ view: 'list' });
        sinon.resetHistory();

        wrapper.vm.setViewFromRouteQuery();

        expect(wrapper.vm.$store.commit.called).toBe(false);
      });

      it('does not set searchResultsView cookie', () => {
        const wrapper = factory({ mocks: { $route: route } });
        wrapper.setData({ view: 'list' });

        wrapper.vm.setViewFromRouteQuery();

        expect(wrapper.vm.$cookies.set.called).toBe(false);
      });
    });
  });
});
