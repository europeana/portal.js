import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt, fakeContentfulExtension } from '../../../utils';
import BootstrapVue from 'bootstrap-vue';

import page from '@/pages/contentful/category-suggest/index';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const fixtures = {
  bees: { fields: { name: { 'en-GB': 'bees' } }, sys: { id: '4cVAVR7T2e7nrFICSkTHnW' } },
  nature: { fields: { name: { 'en-GB': 'nature' } }, sys: { id: '6htEL2kOfAXDdaGYfpZ85C' } },
  performingArts: { fields: { name: { 'en-GB': 'performing arts' } }, sys: { id: '5OeJ1iaee4NRGxqp7o8Nwl' } },
  artNouveau: { fields: { name: { 'en-GB': 'Art Nouveau' } }, sys: { id: '5HZQmIUJZ8j1D8Dw6KUlmg' } },
  art: { fields: { name: { 'en-GB': 'art' } }, sys: { id: '6PmhnUUPgewdQHOshwupUE' } }
};

const contentfulEntryLink = (entry) => ({
  sys: { id: entry.sys.id, type: 'Link', linkType: 'Entry' }
});

const contentfulCategoryFindResponse = {
  items: [fixtures.nature, fixtures.bees]
};

const contentfulCategorySuggestResponse = {
  items: [fixtures.performingArts, fixtures.artNouveau, fixtures.art]
};

const factory = () => shallowMountNuxt(page, {
  localVue,
  mocks: {
    $t: key => key,
    $i18n: {
      isoLocale: () => 'en-GB'
    }
  }
});

describe('pages/contentful/category-suggest/index', () => {
  beforeEach(sinon.resetHistory);
  beforeAll(() => {
    window.contentfulExtension = fakeContentfulExtension({ location: 'field' });
  });

  describe('head', () => {
    describe('title', () => {
      it('is "Category suggest - Contentful app"', () => {
        const wrapper = factory();

        expect(wrapper.vm.head().title).toBe('Category suggest - Contentful app');
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
    describe('findCategories', () => {
      const value = [
        contentfulEntryLink(fixtures.bees),
        contentfulEntryLink(fixtures.nature)
      ];

      it('queries Contentful for current categories', async() => {
        const wrapper = factory();
        wrapper.vm.contentfulExtensionSdk.field.getValue.returns(value);
        wrapper.vm.contentfulExtensionSdk.space.getEntries.resolves(contentfulCategoryFindResponse);

        await wrapper.vm.findCategories();

        expect(wrapper.vm.contentfulExtensionSdk.space.getEntries.calledWith({
          'sys.id[in]': [fixtures.bees.sys.id, fixtures.nature.sys.id].join(',')
        })).toBe(true);
      });

      it('stores the category data, preserving original order', async() => {
        const wrapper = factory();
        wrapper.vm.contentfulExtensionSdk.field.getValue.returns(value);
        wrapper.vm.contentfulExtensionSdk.space.getEntries.resolves(contentfulCategoryFindResponse);

        await wrapper.vm.findCategories();

        expect(wrapper.vm.value.length).toBe(2);
        expect(wrapper.vm.value[0].fields.name['en-GB']).toBe('bees');
        expect(wrapper.vm.value[1].fields.name['en-GB']).toBe('nature');
      });
    });

    describe('suggestCategories', () => {
      describe('when the text input is less than 2 characters', () => {
        const text = 'a';

        it('does not query Contentful', async() => {
          const wrapper = factory();

          await wrapper.vm.suggestCategories(text);

          expect(wrapper.vm.contentfulExtensionSdk.space.getEntries.called).toBe(false);
        });
      });

      describe('when the text input is at least 2 characters', () => {
        const text = 'art';

        it('queries Contentful for suggested categories', async() => {
          const wrapper = factory();

          await wrapper.vm.suggestCategories(text);

          expect(wrapper.vm.contentfulExtensionSdk.space.getEntries.calledWith({
            'content_type': 'category',
            'fields.name[match]': text
          })).toBe(true);
        });

        it('stores the suggestions', async() => {
          const wrapper = factory();
          wrapper.vm.contentfulExtensionSdk.space.getEntries.resolves(contentfulCategorySuggestResponse);

          await wrapper.vm.suggestCategories(text);

          expect(wrapper.vm.suggestions).toEqual(contentfulCategorySuggestResponse.items);
        });
      });
    });

    describe('selectSuggestion', () => {
      it('adds the suggestion to those stored', async() => {
        const wrapper = factory();
        await wrapper.setData({
          value: [fixtures.bees]
        });

        wrapper.vm.selectSuggestion(fixtures.nature);

        expect(wrapper.vm.value.length).toBe(2);
        expect(wrapper.vm.value[0].fields.name['en-GB']).toBe('bees');
        expect(wrapper.vm.value[1].fields.name['en-GB']).toBe('nature');
      });
    });

    describe('removeSelection', () => {
      it('remove the selection from those stored', async() => {
        const wrapper = factory();
        await wrapper.setData({
          value: [fixtures.bees, fixtures.nature]
        });

        wrapper.vm.removeSelection(fixtures.bees);

        expect(wrapper.vm.value.length).toBe(1);
        expect(wrapper.vm.value[0].fields.name['en-GB']).toBe('nature');
      });
    });

    describe('updateContentfulField', () => {
      it('adds links to the stored categories via the SDK', async() => {
        const wrapper = factory();
        await wrapper.setData({
          value: [fixtures.bees, fixtures.nature]
        });

        wrapper.vm.updateContentfulField();

        expect(wrapper.vm.contentfulExtensionSdk.field.setValue.calledWith([
          contentfulEntryLink(fixtures.bees),
          contentfulEntryLink(fixtures.nature)
        ])).toBe(true);
      });
    });
  });
});
