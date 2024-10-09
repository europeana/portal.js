import { createLocalVue, shallowMount } from '@vue/test-utils';
import ItemMediaSidebar from '@/components/item/ItemMediaSidebar';

const localVue = createLocalVue();

const factory = (propsData = {}) => shallowMount(ItemMediaSidebar, {
  localVue,
  attachTo: document.body,
  propsData,
  mocks: {
    $t: (key) => key
  },
  stubs: ['b-link', 'b-tooltip', 'MediaAnnotationList', 'MediaAnnotationSearch']
});

describe('components/item/ItemMediaSidebar', () => {
  describe('template', () => {
    it('renders a sidebar', () => {
      const wrapper = factory();

      const sidebar = wrapper.find('[data-qa="item media sidebar"]');

      expect(sidebar.exists()).toBe(true);
    });

    describe('when there is an annotation URI', () => {
      it('has a tab for annotations', () => {
        const wrapper = factory({ annotationUri: 'https://example.com/iiif/123/annotations' });

        const annotationsTab = wrapper.find('[data-qa="item media sidebar annotations"]');

        expect(annotationsTab.exists()).toBe(true);
      });
    });

    describe('when there is a search URI', () => {
      it('has a tab for search', () => {
        const wrapper = factory({ searchUri: 'https://example.com/iiif/123/search' });

        const searchTab = wrapper.find('[data-qa="item media sidebar search"]');

        expect(searchTab.exists()).toBe(true);
      });
    });

    describe('when there is a manifest URI', () => {
      it('has a tab for links', () => {
        const wrapper = factory({ manifestUri: 'https://example.com/iiif/123/manifest' });

        const linksTab = wrapper.find('[data-qa="item media sidebar links"]');

        expect(linksTab.exists()).toBe(true);
      });
    });
  });
});
