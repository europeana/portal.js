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
});
