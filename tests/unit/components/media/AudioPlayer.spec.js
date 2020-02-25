import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import AudioPlayer from '../../../../components/media/AudioPlayer.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(AudioPlayer, {
  propsData: {
    europeanaIdentifier: '/123/abc',
    src: 'https://example.org',
    type: 'audio/mpeg'
  },
  localVue
});

describe('components/media/AudioPlayer', () => {
  it('has a proxied source', async() => {
    const wrapper = factory();
    const audioSource = wrapper.find('[data-qa="audio source"]');

    audioSource.attributes().src.should.eq('https://proxy.europeana.eu/123/abc?view=https%3A%2F%2Fexample.org');
  });

  it('has a MIME type', async() => {
    const wrapper = factory();
    const audioSource = wrapper.find('[data-qa="audio source"]');

    audioSource.attributes().type.should.eq('audio/mpeg');
  });
});
