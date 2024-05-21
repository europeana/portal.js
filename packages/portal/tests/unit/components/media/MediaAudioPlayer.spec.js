import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import MediaAudioPlayer from '@/components/media/MediaAudioPlayer.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(MediaAudioPlayer, {
  propsData: {
    europeanaIdentifier: '/123/abc',
    src: 'https://example.org',
    type: 'audio/mpeg'
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

describe('components/media/MediaAudioPlayer', () => {
  it('has a proxied source', async() => {
    const wrapper = factory();
    const audioSource = wrapper.find('[data-qa="audio source"]');

    expect(audioSource.attributes().src).toBe('proxied');
  });

  it('has a MIME type', async() => {
    const wrapper = factory();
    const audioSource = wrapper.find('[data-qa="audio source"]');

    expect(audioSource.attributes().type).toBe('audio/mpeg');
  });
});
