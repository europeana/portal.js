import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import VideoPlayer from '../../../../components/media/VideoPlayer.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(VideoPlayer, {
  propsData: {
    src: 'https://example.org',
    type: 'video/webm'
  },
  localVue
});

describe('components/media/VideoPlayer', () => {
  it('has a source', async () => {
    const wrapper = factory();
    const videoSource = wrapper.find('[data-qa="video source"]');

    videoSource.attributes().src.should.eq('https://example.org');
  });

  it('has a MIME type', async () => {
    const wrapper = factory();
    const videoSource = wrapper.find('[data-qa="video source"]');

    videoSource.attributes().type.should.eq('video/webm');
  });
});
