import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import MediaVideoPlayer from '@/components/media/MediaVideoPlayer.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(MediaVideoPlayer, {
  propsData: {
    europeanaIdentifier: '/123/abc',
    src: 'https://example.org',
    type: 'video/webm'
  },
  mocks: {
    $apis: {
      mediaProxy: {
        url: () => 'proxied'
      },
      record: {}
    }
  },
  localVue
});

describe('components/media/MediaVideoPlayer', () => {
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
