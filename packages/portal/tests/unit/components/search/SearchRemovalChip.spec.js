import { createLocalVue, shallowMount } from '@vue/test-utils';
import SearchRemovalChip from '@/components/search/SearchRemovalChip.vue';
import sinon from 'sinon';

const localVue = createLocalVue();

const factory = () => shallowMount(SearchRemovalChip, {
  localVue,
  propsData: {
    title: 'art'
  },
  mocks: {
    $store: {
      commit: sinon.spy()
    },
    $matomo: {
      trackEvent: sinon.spy()
    }
  }
});

describe('components/search/SearchRemovalChip', () => {
  describe('clickEventHandler', () => {
    it('sets the loggable interaction state', () => {
      const wrapper = factory();

      wrapper.vm.clickEventHandler();

      expect(wrapper.vm.$store.commit.calledWith('search/setLoggableInteraction', true)).toBe(true);
    });
  });
});
