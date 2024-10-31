import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import ItemMediaPaginationWidget from '@/components/item/ItemMediaPaginationWidget';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(ItemMediaPaginationWidget, {
  localVue,
  attachTo: document.body,
  mocks: {
    $t: (key) => key
  },
  stubs: ['ItemMediaThumbnails', 'PaginationNavInput']
});

describe('components/item/ItemMediaPaginationWidget', () => {
  describe('template', () => {
    describe('pagination toggle button', () => {
      describe('on click', () => {
        it('closes and opens the item media thumbnails sidebar', () => {
          const wrapper = factory();

          wrapper.find('[data-qa="iiif viewer toolbar pages toggle"]').trigger('click');
          expect(wrapper.vm.showPages).toBe(false);
          wrapper.find('[data-qa="iiif viewer toolbar pages toggle"]').trigger('click');
          expect(wrapper.vm.showPages).toBe(true);
        });

        it('sets focus to the item media thumbnails sidebar', async() => {
          const wrapper = factory();

          wrapper.vm.$refs.itemPages.$el.focus = sinon.spy();
          wrapper.vm.showPages = false;

          wrapper.find('[data-qa="iiif viewer toolbar pages toggle"]').trigger('click');

          await wrapper.vm.$nextTick();

          expect(wrapper.vm.$refs.itemPages.$el.focus.called).toBe(true);
        });
      });
    });
  });
});
