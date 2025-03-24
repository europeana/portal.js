import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';

import ItemPreviewInterface from '@/components/item/ItemPreviewInterface.vue';

const localVue = createLocalVue();

const factory = (mocks = {}) => shallowMount(ItemPreviewInterface, {
  localVue,
  mocks: {
    $cookies: {
      set: sinon.spy()
    },
    $features: {},
    $store: {
      commit: sinon.spy(),
      getters: {
        'search/activeView': 'grid'
      }
    },
    $route: { query: {} },
    $tc: (key) => key,
    ...mocks
  },
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

  describe('setViewFromRouteQuery', () => {
    describe('with view in route query', () => {
      const route = { query: { view: 'mosaic', query: 'sport' } };

      it('updates the stored view', () => {
        const wrapper = factory({ $route: route });
        wrapper.setData({ view: 'list' });

        wrapper.vm.setViewFromRouteQuery();

        expect(wrapper.vm.$store.commit.calledWith('search/setView', 'mosaic')).toBe(true);
      });

      it('sets searchResultsView cookie', () => {
        const wrapper = factory({ $route: route });
        wrapper.setData({ view: 'list' });

        wrapper.vm.setViewFromRouteQuery();

        expect(wrapper.vm.$cookies.set.calledWith('searchResultsView', 'mosaic')).toBe(true);
      });
    });

    describe('without view in route query', () => {
      const route = { query: { query: 'sport' } };

      it('does not update the stored view', () => {
        const wrapper = factory({ $route: route });
        wrapper.setData({ view: 'list' });
        sinon.resetHistory();

        wrapper.vm.setViewFromRouteQuery();

        expect(wrapper.vm.$store.commit.called).toBe(false);
      });

      it('does not set searchResultsView cookie', () => {
        const wrapper = factory({ $route: route });
        wrapper.setData({ view: 'list' });

        wrapper.vm.setViewFromRouteQuery();

        expect(wrapper.vm.$cookies.set.called).toBe(false);
      });
    });
  });
});
