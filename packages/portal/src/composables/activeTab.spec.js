import sinon from 'sinon';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import * as vueRouter from 'vue2-helpers/vue-router';
import { reactive } from 'vue';

import useActiveTab from '@/composables/activeTab.js';

const routerPushSpy = sinon.spy();
const routerReplaceSpy = sinon.spy();

const route = reactive({ hash: '#links' });
sinon.stub(vueRouter, 'useRoute').returns(route);
sinon.stub(vueRouter, 'useRouter').returns({
  push: routerPushSpy,
  replace: routerReplaceSpy
});

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

    it('updates route query if supplied option `query`', async() => {
      const wrapper = factory({ query: 'tab' });
      wrapper.vm.watchTabIndex();

      wrapper.find('#activeTabIndex').setValue(1);
      await wrapper.vm.$nextTick();

      expect(routerReplaceSpy.calledWith({ hash: undefined, query: { tab: 'search' } })).toBe(true);
    });

    it('uses push instead of replace if supplied option replaceRoute: false', async() => {
      const wrapper = factory({ replaceRoute: false });
      wrapper.vm.watchTabIndex();

      wrapper.find('#activeTabIndex').setValue(1);
      await wrapper.vm.$nextTick();

      expect(routerPushSpy.calledWith({ hash: '#search' })).toBe(true);
    });
  });
});
