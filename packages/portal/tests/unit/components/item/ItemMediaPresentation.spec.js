import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import ItemMediaPresentation from '@/components/item/ItemMediaPresentation';
// import sinon from 'sinon';

const localVue = createLocalVue();

const factory = ({ propsData = {}, mocks = {} } = {}) => shallowMountNuxt(ItemMediaPresentation, {
  localVue,
  attachTo: document.body,
  propsData,
  mocks: {
    $t: (key) => key,
    ...mocks
  },
  stubs: ['PaginationNavInput', 'b-button']
});

describe('components/item/ItemMediaPresentation', () => {
  describe('template', () => {
    it('renders a viewer wrapper', () => {
      const wrapper = factory();

      const viewerWrapper = wrapper.find('.iiif-viewer-wrapper');

      expect(viewerWrapper.isVisible()).toBe(true);
    });
  });
});
