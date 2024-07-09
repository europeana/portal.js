import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import StoriesTagsDropdown from '@/components/stories/StoriesTagsDropdown.vue';

const localVue = createLocalVue();

localVue.use(BootstrapVue);

const categoriesContentfulResponse = {
  data: {
    data: {
      categoryCollection: {
        items: [
          { identifier: '3d', name: '3D' },
          { identifier: 'cooking', name: 'cooking' },
          { identifier: 'postcards', name: 'postcards' }
        ]
      }
    }
  }
};

const filteredTags = ['3d'];

const factory = (props) => shallowMountNuxt(StoriesTagsDropdown, {
  localVue,
  propsData: props,
  mocks: {
    $contentful: {
      query: sinon.stub().withArgs('categories', sinon.match.object).resolves(categoriesContentfulResponse)
    },
    $i18n: {
      locale: 'en',
      localeProperties: { iso: 'en-GB' }
    },
    $route: {
      query: {}
    },
    $t: (key) => key
  }
});

describe('components/stories/StoriesTagsDropdown', () => {
  it('fetches categories from Contentful', async() => {
    const wrapper = factory();
    await wrapper.vm.fetch();

    expect(wrapper.vm.tags.length).toBe(3);
  });

  describe('when searching for tag', () => {
    it('filters by keyword', async() => {
      const wrapper = factory();
      await wrapper.vm.fetch();

      wrapper.vm.searchTag = 'post';

      expect(wrapper.vm.displayTags.length).toBe(1);
    });
  });

  describe('showDropdown', () => {
    it('toggles the tag dropdown', async() => {
      const wrapper = factory();
      await wrapper.setData({
        showDropdown: true
      });

      const dropdown = wrapper.find('[data-qa="tags search dropdown"]');

      expect(dropdown.isVisible()).toBe(true);
    });
  });

  describe('when tags are filtered', () => {
    it('displays the filtered tags', async() => {
      const wrapper = factory({ filteredTags });
      await wrapper.vm.fetch();

      expect(wrapper.vm.displayTags.length).toBe(1);
    });
  });

  describe('when user clicks outside the search form dropdown', () => {
    it('hides the search options', async() => {
      const handleClickOrTabOutsideEvent = new Event('click');
      const wrapper = factory();

      await wrapper.setData({ showDropdown: true });
      wrapper.vm.handleClickOrTabOutside(handleClickOrTabOutsideEvent);

      expect(wrapper.vm.showDropdown).toBe(false);
    });
  });

  describe('when user tabs outside the search form dropdown', () => {
    it('hides the search options', async() => {
      const tabOutsideEvent = new KeyboardEvent('keydown', { 'key': 'Tab' });
      const wrapper = factory();

      await wrapper.setData({ showDropdown: true });
      wrapper.vm.handleClickOrTabOutside(tabOutsideEvent);

      expect(wrapper.vm.showDropdown).toBe(false);
    });
  });

  describe('when user uses escape key', () => {
    it('hides the search options', async() => {
      const escapeEvent = new KeyboardEvent('keydown', { 'key': 'Escape' });
      const wrapper = factory();

      await wrapper.setData({ showDropdown: true });
      wrapper.vm.handleClickOrTabOutside(escapeEvent);

      expect(wrapper.vm.showDropdown).toBe(false);
    });
  });
});
