import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';
import BootstrapVue from 'bootstrap-vue';

import page from '@/pages/contentful/set-suggest/index';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMountNuxt(page, {
  localVue,
  mocks: {
    $t: key => key,
    $apis: {
      set: {
        get: sinon.stub().resolves({ title: { en: 'Set 1' } }),
        search: sinon.stub().resolves({ data: {} })
      }
    }
  }
});

describe('pages/contentful/set-suggest/index', () => {
  afterEach(sinon.resetHistory);

  describe('head', () => {
    describe('title', () => {
      it('is "Set suggest - Contentful app"', () => {
        const wrapper = factory();

        expect(wrapper.vm.head().title).toBe('Set suggest - Contentful app');
      });
    });
  });

  describe('methods', () => {
    describe('findSets', () => {
      const value = [
        'http://data.europeana.eu/set/1',
        'http://data.europeana.eu/set/2'
      ];

      it('queries the Set API for current sets', async() => {
        const wrapper = factory();

        await wrapper.vm.findSets(value);

        expect(wrapper.vm.$apis.set.get.calledWith(value[0])).toBe(true);
        expect(wrapper.vm.$apis.set.get.calledWith(value[1])).toBe(true);
      });
    });

    describe('suggestSets', () => {
      it('queries the Set API for suggestions', async() => {
        const wrapper = factory();
        const text = 'black';

        await wrapper.vm.suggestSets(text);

        expect(wrapper.vm.$apis.set.search.calledWith(
          { query: text, qf: 'visibility:published', profile: 'items.meta' }
        )).toBe(true);
      });
    });
  });
});
