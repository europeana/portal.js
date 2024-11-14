import { createLocalVue, shallowMount } from '@vue/test-utils';
import ItemMediaThumbnail from '@/components/item/ItemMediaThumbnail';

const localVue = createLocalVue();

const factory = ({ propsData = {}, mocks = {} } = {}) => shallowMount(ItemMediaThumbnail, {
  localVue,
  propsData,
  mocks: {
    $route: { path: '/mock/path/', query: {} },
    $t: (key, opts) => key + JSON.stringify(opts),
    $n: num => num,
    $nuxt: {},
    ...mocks
  },
  stubs: ['NuxtLink']
});

const props = {
  edmType: 'image',
  offset: 0,
  resource: {
    edm: {
      thumbnails: () => {
        return { small: '', large: '' };
      },
      edmType: ''
    }
  }
};

describe('components/item/ItemMediaThumbnail', () => {
  describe('template', () => {
    it('renders a item media thumbnail', () => {
      const wrapper = factory({ propsData: props });

      const thumbnail = wrapper.find('.item-media-thumbnail');

      expect(thumbnail.isVisible()).toBe(true);
    });
  });

  describe('link', () => {
    it('uses current URL, removing any annotation links, plus adds the page as a query param', () => {
      const wrapper = factory({ propsData: { ...props, offset: 5 } });

      const pageLink = wrapper.vm.link;

      expect(pageLink).toStrictEqual({
        hash: undefined,
        path: '/mock/path/',
        query: { page: 6, anno: undefined }
      });
    });
  });

  describe('label', () => {
    it('uses the current page in the formated label', () => {
      const wrapper = factory({ propsData: { ...props, offset: 5 } });

      const pageLabel = wrapper.vm.label;

      expect(pageLabel).toBe(6);
    });
  });
});
