import sinon from 'sinon';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import * as vueRouter from 'vue2-helpers/vue-router';
import { reactive } from 'vue';

import useActiveTab from '@/composables/activeTab.js';

const routerPushSpy = sinon.spy();

const route = reactive({ hash: '#links' });
sinon.stub(vueRouter, 'useRoute').returns(route);
sinon.stub(vueRouter, 'useRouter').returns({
  push: routerPushSpy
});

const tabHashes = ['#annotations', '#search', '#links'];

const component = {
  template: `
    <div>
      <span id="activeTabHash">{{ activeTabHash }}</span>
      <input id="activeTabIndex" v-model="activeTabIndex" />
    </div>
  `,
  setup() {
    const { activeTabHash, activeTabIndex } = useActiveTab(tabHashes);

    return { activeTabHash, activeTabIndex };
  }
};

const localVue = createLocalVue();

const factory = () => shallowMount(component, {
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

  describe('activeTabHash', () => {
    it('is computed from activeTabIndex', async() => {
      const wrapper = factory();

      wrapper.find('#activeTabIndex').setValue(1);
      await wrapper.vm.$nextTick();

      const span = wrapper.find('#activeTabHash');
      expect(span.text()).toBe('#search');
    });
  });

  describe('activeTabIndex', () => {
    it('is initialised from route hash', () => {
      const wrapper = factory();

      const input = wrapper.find('#activeTabIndex');

      expect(input.element.value).toBe('2');
    });

    it('is watched for changes to update route', async() => {
      const wrapper = factory();

      wrapper.find('#activeTabIndex').setValue(1);
      await wrapper.vm.$nextTick();

      expect(routerPushSpy.calledWith({ hash: '#search' })).toBe(true);
    });

    it('is updated on route changes', async() => {
      const wrapper = factory();

      route.hash = '#annotations';
      await wrapper.vm.$nextTick();

      const input = wrapper.find('#activeTabIndex');
      expect(input.element.value).toBe('0');
    });
  });
});
