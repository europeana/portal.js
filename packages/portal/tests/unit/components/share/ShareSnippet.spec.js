import { createLocalVue, shallowMount } from '@vue/test-utils';
import ShareSnippet from '@/components/share/ShareSnippet.vue';

const localVue = createLocalVue();

const text = 'example text';

const factory = (propsData = { text }) => shallowMount(ShareSnippet, {
  localVue,
  propsData,
  mocks: {
    $t: (key) => key
  },
  stubs: ['b-button']
});

describe('components/share/ShareSnippet', () => {
  describe('when there is text to copy', () => {
    it('is shown as text snippet', () => {
      const wrapper = factory();
      const snippet = wrapper.find('.snippet');

      expect(snippet.text()).toEqual(text);
    });

    describe('when the snippet is clicked', () => {
      it('copies the embed code to the clipboard and shows a notification message', async() => {
        const wrapper = factory();
        const snippet = wrapper.find('.snippet');

        await snippet.trigger('click');

        expect(global.navigator.clipboard.writeText.calledWith(text)).toBe(true);
        expect(wrapper.find('output.copy-to-clipboard-success').isVisible()).toBe(true);
      });
    });
  });

  describe('when there is no text', () => {
    it('does not render the component', () => {
      const wrapper = factory({ text: null });

      expect(wrapper.find('div').exists()).toBe(false);
    });
  });
});
