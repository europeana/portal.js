import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt, fakeContentfulExtension } from '@test/utils.js';
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
      localeProperties: { iso: 'en-GB' }
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

  describe('methods', () => {
    describe('findCategories', () => {
      const value = [
        contentfulEntryLink(fixtures.bees),
        contentfulEntryLink(fixtures.nature)
      ];

      it('queries Contentful for current categories', async() => {
        const wrapper = factory();
        wrapper.vm.contentfulExtensionSdk.space.getEntries.resolves(contentfulCategoryFindResponse);

        await wrapper.vm.findCategories(value);

        expect(wrapper.vm.contentfulExtensionSdk.space.getEntries.calledWith({
          'sys.id[in]': [fixtures.bees.sys.id, fixtures.nature.sys.id].join(',')
        })).toBe(true);
      });

      it('returns the category data, preserving original order', async() => {
        const wrapper = factory();
        wrapper.vm.contentfulExtensionSdk.space.getEntries.resolves(contentfulCategoryFindResponse);

        const categories = await wrapper.vm.findCategories(value);

        expect(categories.length).toBe(2);
        expect(categories[0].fields.name['en-GB']).toBe('bees');
        expect(categories[1].fields.name['en-GB']).toBe('nature');
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

        it('returns the suggestions', async() => {
          const wrapper = factory();
          wrapper.vm.contentfulExtensionSdk.space.getEntries.resolves(contentfulCategorySuggestResponse);

          const categories = await wrapper.vm.suggestCategories(text);

          expect(categories).toEqual(contentfulCategorySuggestResponse.items);
        });
      });
    });
  });
});
