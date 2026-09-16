import { shallowMount } from '@vue/test-utils';
import MediaErrorMessage from '@/components/media/MediaErrorMessage.vue';

const factory = () => shallowMount(MediaErrorMessage, {
  mocks: {
    $t: (key) => key
  }
});

describe('components/media/MediaErrorMessage', () => {
  it('shows a message about the media not being displayable', async() => {
    const wrapper = factory();

    const message =  wrapper.find('.media-error-message');

    expect(message.text()).toContain('errorMessage.mediaFailure.description');
  });
});
