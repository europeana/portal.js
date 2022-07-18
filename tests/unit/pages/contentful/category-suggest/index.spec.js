import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt, fakeContentfulExtension } from '../../../utils';
import BootstrapVue from 'bootstrap-vue';

import page from '@/pages/contentful/category-suggest/index';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const fixtures = {
  bees: { name: 'bees', sys: { id: '4cVAVR7T2e7nrFICSkTHnW' } },
  nature: { name: 'nature', sys: { id: '6htEL2kOfAXDdaGYfpZ85C' } },
  performingArts: { name: 'performing arts', sys: { id: '5OeJ1iaee4NRGxqp7o8Nwl' } },
  artNouveau: { name: 'Art Nouveau', sys: { id: '5HZQmIUJZ8j1D8Dw6KUlmg' } },
  art: { name: 'art', sys: { id: '6PmhnUUPgewdQHOshwupUE' } }
};

const contentfulEntryLink = (entry) => ({
  sys: { id: entry.sys.id, type: 'Link', linkType: 'Entry' }
});

const contentfulCategoryFindResponse = {
  data: {
    data: {
      categoryCollection: {
        items: [fixtures.nature, fixtures.bees]
      }
    }
  }
};

const contentfulCategorySuggestResponse = {
  data: {
    data: {
      categoryCollection: {
        items: [fixtures.performingArts, fixtures.artNouveau, fixtures.art]
      }
    }
  }
};

const contentfulQueryStub = sinon.stub();
contentfulQueryStub.withArgs('categoryFind', sinon.match.object).resolves(contentfulCategoryFindResponse);
contentfulQueryStub.withArgs('categorySuggest', sinon.match.object).resolves(contentfulCategorySuggestResponse);

const factory = () => shallowMountNuxt(page, {
  localVue,
  mocks: {
    $t: key => key,
    $i18n: {
      isoLocale: () => 'en-GB'
    },
    $route: { query: {} },
    $pageHeadTitle: key => key,
    $contentful: {
      query: contentfulQueryStub
    }
  }
});

describe('pages/contentful/category-suggest/index', () => {
  beforeEach(sinon.resetHistory);
  beforeAll(() => {
    window.contentfulExtension = fakeContentfulExtension();
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

        await wrapper.vm.findCategories();

        expect(contentfulQueryStub.calledWith('categoryFind', {
          ids: [fixtures.bees.sys.id, fixtures.nature.sys.id],
          locale: 'en-GB',
          preview: false
        })).toBe(true);
      });

      it('stores the category data, preserving original order', async() => {
        const wrapper = factory();
        wrapper.vm.contentfulExtensionSdk.field.getValue.returns(value);

        await wrapper.vm.findCategories();

        expect(wrapper.vm.value.length).toBe(2);
        expect(wrapper.vm.value[0].name).toBe('bees');
        expect(wrapper.vm.value[1].name).toBe('nature');
      });
    });

    describe('suggestCategories', () => {
      describe('when the text input is less than 2 characters', () => {
        const text = 'a';

        it('does not query Contentful', async() => {
          const wrapper = factory();

          await wrapper.vm.suggestCategories(text);

          expect(contentfulQueryStub.called).toBe(false);
        });
      });

      describe('when the text input is at least 2 characters', () => {
        const text = 'art';

        it('queries Contentful for suggested categories', async() => {
          const wrapper = factory();

          await wrapper.vm.suggestCategories(text);

          expect(contentfulQueryStub.calledWith('categorySuggest', {
            text,
            locale: 'en-GB',
            preview: false
          })).toBe(true);
        });

        it('stores the suggestions', async() => {
          const wrapper = factory();
          const text = 'art';

          await wrapper.vm.suggestCategories(text);

          expect(wrapper.vm.suggestions).toEqual(contentfulCategorySuggestResponse.data.data.categoryCollection.items);
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
        expect(wrapper.vm.value[0].name).toBe('bees');
        expect(wrapper.vm.value[1].name).toBe('nature');
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
        expect(wrapper.vm.value[0].name).toBe('nature');
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

  describe('head', () => {
    it('sets the title to: Category suggest - Contentful app', () => {
      const wrapper = factory();

      expect(wrapper.vm.head().title).toBe('Category suggest - Contentful app');
    });
  });
});
