import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import VideoPlayer from '@/components/media/VideoPlayer.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(VideoPlayer, {
  propsData: {
    europeanaIdentifier: '/123/abc',
    src: 'https://example.org',
    type: 'video/webm'
  },
  mocks: {
    $apis: {
      record: {
        mediaProxyUrl: () => 'proxied'
      }
    }
  },
  localVue
});

describe('components/media/VideoPlayer', () => {
  it('has a proxied source', async() => {
    const wrapper = factory();
    const videoSource = wrapper.find('[data-qa="video source"]');

    expect(videoSource.attributes().src).toBe('proxied');
  });

  it('has a MIME type', async() => {
    const wrapper = factory();
    const videoSource = wrapper.find('[data-qa="video source"]');

    expect(videoSource.attributes().type).toBe('video/webm');
  });
});
