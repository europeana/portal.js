import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import StoriesTagsDropdown from '@/components/stories/StoriesTagsDropdown.vue';

const localVue = createLocalVue();

localVue.use(BootstrapVue);

const categoriesContentfulResponse = {
  data: {
    categoryCollection: {
      items: [
        { identifier: '3d', name: '3D' },
        { identifier: 'cooking', name: 'cooking' },
        { identifier: 'postcards', name: 'postcards' }
      ]
    }
  }
};
const contentfulQueryStub = sinon.stub();
contentfulQueryStub.resolves(categoriesContentfulResponse);

const filteredTags = ['3d'];

const factory = (props) => shallowMountNuxt(StoriesTagsDropdown, {
  localVue,
  propsData: props,
  mocks: {
    $contentful: {
      query: contentfulQueryStub
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
  afterEach(sinon.resetHistory);
  afterAll(sinon.restore);

  it('fetches categories from Contentful', async() => {
    const wrapper = factory();
    await wrapper.vm.fetch();

    expect(wrapper.vm.tags.length).toBe(3);
  });

  describe('on focusin event', () => {
    it('makes the click outside handler active, opens the dropdown', async() => {
      const wrapper = factory();
      await wrapper.vm.handleFocusin();
      expect(wrapper.vm.clickOutsideConfig.isActive).toBe(true);
      expect(wrapper.vm.showDropdown).toBe(true);
    });
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
      const wrapper = factory();

      await wrapper.setData({ showDropdown: true });
      wrapper.vm.handleClickOutside();

      expect(wrapper.vm.showDropdown).toBe(false);
    });
  });

  describe('when user uses escape key', () => {
    it('hides the search options', async() => {
      const wrapper = factory();

      await wrapper.setData({ showDropdown: true });
      const dropdown = wrapper.find('[data-qa="tags dropdown"]');
      dropdown.trigger('keydown.esc');

      expect(wrapper.vm.showDropdown).toBe(false);
    });
  });
});
