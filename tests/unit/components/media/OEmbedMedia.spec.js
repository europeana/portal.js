import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import OEmbedMedia from '../../../../components/media/OEmbedMedia.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(OEmbedMedia, {
  propsData: {
    oEmbedData: {
      html: '<iframe src=\'https://player.vimeo.com/video/112866269\' width=\'640\' height=\'360\' frameborder=\'0\' allow=\'autoplay; fullscreen\' allowfullscreen></iframe>'
    }
  },
  localVue
});

describe('components/media/OEmbedMedia', () => {
  it('has html', async() => {
    const wrapper = factory();
    const container = wrapper.find('[data-qa="oembed media container"]');

    container.contains('iframe').should.be.true;
  });
});
