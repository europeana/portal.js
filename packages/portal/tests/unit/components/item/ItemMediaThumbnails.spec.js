import { createLocalVue, shallowMount } from '@vue/test-utils';
import ItemMediaThumbnails from '@/components/item/ItemMediaThumbnails';
// import sinon from 'sinon';

const localVue = createLocalVue();

const factory = ({ propsData = {}, mocks = {} } = {}) => shallowMount(ItemMediaThumbnails, {
  localVue,
  propsData,
  mocks: {
    $t: (key) => key,
    ...mocks
  }
});

const props = {
  edmType: 'image',
  selectedIndex: 0,
  resources: [{
    edmType: ''
  }]
};

describe('components/item/ItemMediaThumbnail', () => {
  describe('template', () => {
    it('renders a item media thumbnail', () => {
      const wrapper = factory({ propsData: props });

      const thumbnail = wrapper.find('.media-thumbnails');

      expect(thumbnail.isVisible()).toBe(true);
    });
  });
});
