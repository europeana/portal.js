import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import ItemMediaThumbnail from '@/components/item/ItemMediaThumbnail';
// import sinon from 'sinon';

const localVue = createLocalVue();

const factory = ({ propsData = {}, mocks = {} } = {}) => shallowMountNuxt(ItemMediaThumbnail, {
  localVue,
  attachTo: document.body,
  propsData,
  mocks: {
    $route: { query: {} },
    $t: (key) => key,
    ...mocks
  }
});

const props = {
  edmType: 'image',
  offset: 0,
  resource: {
    edmType: ''
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
});
