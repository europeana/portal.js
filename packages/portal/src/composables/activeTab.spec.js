import sinon from 'sinon';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import { computed, reactive } from 'vue';

import * as vueRouter from './vueRouter.js';
import useActiveTab from '@/composables/activeTab.js';

const routerPushSpy = sinon.spy();
const routerReplaceSpy = sinon.spy();

const route = reactive({ hash: '#links' });
const router = {
  push: routerPushSpy,
  replace: routerReplaceSpy
};
sinon.stub(vueRouter, 'useRoute').returns(computed(() => route));
sinon.stub(vueRouter, 'useRouter').returns(computed(() => router));

const tabIds = ['annotations', 'search', 'links'];

const component = (options = {}) => ({
  template: `
    <div>
      <span id="activeTabId">{{ activeTabId }}</span>
      <input id="activeTabIndex" v-model="activeTabIndex" />
    </div>
  `,
  setup() {
    const { activeTabId, activeTabIndex, watchTabIndex } = useActiveTab(tabIds, options);

    return { activeTabId, activeTabIndex, watchTabIndex };
  }
});

const localVue = createLocalVue();

const factory = (componentOptions = {}) => shallowMount(component(componentOptions), {
  propsData: {},
  mocks: {},
  localVue
});

describe('useActiveTab', () => {
  beforeEach(() => {
    route.hash = '#links';
  });
  afterEach(sinon.resetHistory);
  afterAll(sinon.restore);

  describe('activeTabId', () => {
    it('is computed from activeTabIndex', async() => {
      const wrapper = factory();

      wrapper.find('#activeTabIndex').setValue(1);
      await wrapper.vm.$nextTick();

      const span = wrapper.find('#activeTabId');
      expect(span.text()).toBe('search');
    });
  });

  describe('activeTabIndex', () => {
    it('is initialised from route hash', () => {
      const wrapper = factory();

      const input = wrapper.find('#activeTabIndex');

      expect(input.element.value).toBe('2');
    });

    it('is updated on route changes', async() => {
      const wrapper = factory();

      route.hash = '#annotations';
      await wrapper.vm.$nextTick();

      const input = wrapper.find('#activeTabIndex');
      expect(input.element.value).toBe('0');
    });
  });

  describe('watchTabIndex', () => {
    it('starts watching for changes to replace hash in route', async() => {
      const wrapper = factory();
      wrapper.vm.watchTabIndex();

      wrapper.find('#activeTabIndex').setValue(1);
      await wrapper.vm.$nextTick();

      expect(routerReplaceSpy.calledWith({ hash: '#search' })).toBe(true);
    });

    describe('when supplied option `query`', () => {
      const options = { query: 'tab' };

      it('updates route query instead of hash', async() => {
        const wrapper = factory(options);
        wrapper.vm.watchTabIndex();

        wrapper.find('#activeTabIndex').setValue(1);
        await wrapper.vm.$nextTick();

        expect(routerReplaceSpy.calledWith({ hash: undefined, query: { tab: 'search' } })).toBe(true);
      });
    });

    describe('when supplied option `replaceRoute: false`', () => {
      const options = { replaceRoute: false };

      it('uses push instead of replace if', async() => {
        const wrapper = factory(options);
        wrapper.vm.watchTabIndex();

        wrapper.find('#activeTabIndex').setValue(1);
        await wrapper.vm.$nextTick();

        expect(routerPushSpy.calledWith({ hash: '#search' })).toBe(true);
      });
    });
  });
});

