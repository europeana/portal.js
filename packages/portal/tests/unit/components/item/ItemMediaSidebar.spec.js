import { createLocalVue, shallowMount } from '@vue/test-utils';
import ItemMediaSidebar from '@/components/item/ItemMediaSidebar';

const localVue = createLocalVue();

const factory = (propsData = {}) => shallowMount(ItemMediaSidebar, {
  localVue,
  propsData,
  mocks: {
    $t: (key) => key
  },
  stubs: ['b-link']
});

describe('components/item/ItemMediaSidebar', () => {
  describe('template', () => {
    it('renders a sidebar', () => {
      const wrapper = factory();

      const sidebar = wrapper.find('[data-qa="item media sidebar"]');

      expect(sidebar.exists()).toBe(true);
    });

    describe('when there is a manifest URI', () => {
      it('has a tab for links', () => {
        const wrapper = factory({ uri: 'https://example.com/iiif/123/manifest' });

        const linksTab = wrapper.find('[data-qa="item media sidebar links"]');

        expect(linksTab.exists()).toBe(true);
      });
    });
  });
});
