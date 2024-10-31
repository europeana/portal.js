import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import ItemMediaSidebarWidget from '@/components/item/ItemMediaSidebarWidget';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData = {}) => shallowMount(ItemMediaSidebarWidget, {
  localVue,
  attachTo: document.body,
  propsData,
  mocks: {
    $route: { query: {} },
    $t: (key) => key
  }
});

describe('components/item/ItemMediaSidebarWidget', () => {
  describe('template', () => {
    describe('sidebar toggle button', () => {
      describe('on click', () => {
        it('opens the sidebar', () => {
          const wrapper = factory({ uri: 'https://example.org/manifest' });

          wrapper.find('[data-qa="iiif viewer toolbar sidebar toggle"]').trigger('click');

          expect(wrapper.vm.showSidebar).toBe(true);
        });

        it('sets focus to the sidebar', async() => {
          const wrapper = factory({ uri: 'https://example.org/manifest' });
          wrapper.vm.$refs.sidebar.$el.focus = sinon.spy();

          wrapper.find('[data-qa="iiif viewer toolbar sidebar toggle"]').trigger('click');

          await wrapper.vm.$nextTick();

          expect(wrapper.vm.$refs.sidebar.$el.focus.called).toBe(true);
        });
      });
    });
  });
});
