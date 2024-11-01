import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import ItemMediaSidebarToggle from '@/components/item/ItemMediaSidebarToggle';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(ItemMediaSidebarToggle, {
  localVue,
  attachTo: document.body,
  mocks: {
    $t: (key) => key
  }
});

describe('components/item/ItemMediaSidebarToggle', () => {
  describe('template', () => {
    describe('sidebar toggle button', () => {
      describe('on click', () => {
        it('emits the toggleSidebar event', () => {
          const wrapper = factory();

          wrapper.find('[data-qa="iiif viewer toolbar sidebar toggle"]').trigger('click');

          expect(wrapper.emitted('toggleSidebar').length).toEqual(1);
        });
      });
    });
  });
});
