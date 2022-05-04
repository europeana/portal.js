import { shallowMount } from '@vue/test-utils';
import DefaultThumbnail from '@/components/generic/DefaultThumbnail.vue';

const factory = () => shallowMount(DefaultThumbnail);

describe('components/generic/DefaultThumbnail', () => {
  it('shows a default thumbnail', async() => {
    const wrapper = factory();
    await wrapper.setProps({ mediaType: 'SOUND' });

    const thumbnail =  wrapper.find('[data-qa="default thumbnail"]');
    expect(thumbnail.find('[class="icon-sound"]').exists()).toBe(true);
  });

  describe('when an offset is supplied', () => {
    const offset = 20;
    it('selects a colour based on the offset', async() => {
      const wrapper = factory();
      await wrapper.setProps({ offset });

      const placeholderColor =  wrapper.vm.placeholderColor;

      expect(placeholderColor).toBe('#837F99');
    });
  });
});
