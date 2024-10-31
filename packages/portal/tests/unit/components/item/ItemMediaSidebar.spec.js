import { createLocalVue, shallowMount } from '@vue/test-utils';
import ItemMediaSidebar from '@/components/item/ItemMediaSidebar';

const localVue = createLocalVue();

const factory = (propsData = {}) => shallowMount(ItemMediaSidebar, {
  localVue,
  attachTo: document.body,
  propsData,
  mocks: {
    $t: (key) => key,
    $tc: (key, count) => `${key} ${count}`
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

    describe('when there is an annotation list', () => {
      it('has a tab for annotations', () => {
        const wrapper = factory({ annotationList: true });

        const annotationsTab = wrapper.find('[data-qa="item media sidebar annotations"]');

        expect(annotationsTab.exists()).toBe(true);
      });
    });

    describe('when there is an annotation search service', () => {
      it('has a tab for search', () => {
        const wrapper = factory({ annotationSearch: true });

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

  describe('methods', () => {
    describe('handleAnnotationsFetched', () => {
      it('sets the annotations count to be displayed in the title', async() => {
        const wrapper = factory({ annotationList: true });

        const annotationsTitle = wrapper.find('[data-qa="item media sidebar annotations title"]');

        expect(annotationsTitle.text()).toBe('media.sidebar.annotationsCount null');

        wrapper.vm.handleAnnotationsFetched(40);

        await wrapper.vm.$nextTick();

        expect(annotationsTitle.text()).toBe('media.sidebar.annotationsCount 40');
      });
    });
  });
});
