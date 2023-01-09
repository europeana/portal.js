import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt, fakeContentfulExtension } from '../../../utils';
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
  beforeAll(() => {
    window.contentfulExtension = fakeContentfulExtension({ location: 'field' });
  });
  afterEach(sinon.resetHistory);

  describe('head', () => {
    describe('title', () => {
      it('is "Set suggest - Contentful app"', () => {
        const wrapper = factory();

        expect(wrapper.vm.head().title).toBe('Set suggest - Contentful app');
      });
    });
  });

  describe('mounted', () => {
    it('triggers the window auto resizer', () => {
      const wrapper = factory();

      expect(wrapper.vm.contentfulExtensionSdk.window.startAutoResizer.called).toBe(true);
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
        wrapper.vm.contentfulExtensionSdk.field.getValue.returns(value);

        await wrapper.vm.findSets();

        expect(wrapper.vm.$apis.set.get.calledWith(value[0], { profile: 'standard' })).toBe(true);
        expect(wrapper.vm.$apis.set.get.calledWith(value[1], { profile: 'standard' })).toBe(true);
      });

      // it('stores the category data, preserving original order', async() => {
      //   const wrapper = factory();
      //   wrapper.vm.contentfulExtensionSdk.field.getValue.returns(value);
      //   wrapper.vm.contentfulExtensionSdk.space.getEntries.resolves(contentfulCategoryFindResponse);
      //
      //   await wrapper.vm.findSets();
      //
      //   expect(wrapper.vm.value.length).toBe(2);
      //   expect(wrapper.vm.value[0].fields.name['en-GB']).toBe('bees');
      //   expect(wrapper.vm.value[1].fields.name['en-GB']).toBe('nature');
      // });
    });

    describe('suggestSets', () => {
      it('queries the Set API for suggestions', async() => {
        const wrapper = factory();
        const text = 'black';

        await wrapper.vm.suggestSets(text);

        expect(wrapper.vm.$apis.set.search.calledWith(
          { query: text, qf: 'visibility:published', profile: 'standard' }
        )).toBe(true);
      });
    });
  });
});
