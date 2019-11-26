import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import AudioPlayer from '../../../../components/media/AudioPlayer.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(AudioPlayer, {
  propsData: {
    src: 'https://example.org',
    type: 'audio/mpeg'
  },
  localVue
});

describe('components/media/AudioPlayer', () => {
  it('has a source', async() => {
    const wrapper = factory();
    const audioSource = wrapper.find('[data-qa="audio source"]');

    audioSource.attributes().src.should.eq('https://example.org');
  });

  it('has a MIME type', async() => {
    const wrapper = factory();
    const audioSource = wrapper.find('[data-qa="audio source"]');

    audioSource.attributes().type.should.eq('audio/mpeg');
  });
});
