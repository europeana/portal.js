import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import ItemMediaPaginationToolbar from '@/components/item/ItemMediaPaginationToolbar';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(ItemMediaPaginationToolbar, {
  localVue,
  attachTo: document.body,
  mocks: {
    $t: (key) => key
  },
  stubs: ['ItemMediaThumbnails', 'PaginationNavInput']
});

describe('components/item/ItemMediaPaginationToolbar', () => {
  describe('template', () => {
    describe('pagination toggle button', () => {
      describe('on click', () => {
        it('emits the togglePages event', () => {
          const wrapper = factory();

          wrapper.find('[data-qa="media viewer toolbar pages toggle"]').trigger('click');

          expect(wrapper.emitted('togglePages').length).toEqual(1);
        });
      });
    });
  });
});
