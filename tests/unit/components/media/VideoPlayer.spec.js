import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import VideoPlayer from '../../../../components/media/VideoPlayer.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(VideoPlayer, {
  propsData: {
    src: 'https://example.org'
  },
  localVue
});

describe('components/media/VideoPlayer', () => {
  it('has a video', async() => {
    const wrapper = factory();
    const videoSource = wrapper.find('[data-qa="video"]');

    videoSource.attributes().src.should.eq('https://example.org');
  });
});
