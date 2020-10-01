import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import HTMLEmbed from '../../../../components/generic/HTMLEmbed.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(HTMLEmbed, {
  propsData: {
    html: '<iframe src=\'https://player.vimeo.com/video/112866269\' width=\'640\' height=\'360\' frameborder=\'0\' allow=\'autoplay; fullscreen\' allowfullscreen></iframe>',
    error: 'Error: Request failed with status code 404'
  },
  localVue
});

describe('components/media/OEmbedMedia', () => {
  it('has html', async() => {
    const wrapper = factory();
    const container = wrapper.find('[data-qa="html embed"]');

    container.contains('iframe').should.be.true;
  });
});
