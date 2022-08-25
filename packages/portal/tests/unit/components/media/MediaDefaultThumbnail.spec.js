import { shallowMount } from '@vue/test-utils';
import MediaDefaultThumbnail from '@/components/media/MediaDefaultThumbnail.vue';

const factory = () => shallowMount(MediaDefaultThumbnail);

describe('components/media/MediaDefaultThumbnail', () => {
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

  describe('when no media type is available', () => {
    it('uses the icon-unavailable class for the icon', async() => {
      const wrapper = factory();

      const thumbnail =  wrapper.find('[data-qa="default thumbnail"]');
      expect(thumbnail.find('[class="icon-unavailable"]').exists()).toBe(true);
    });
  });
});
