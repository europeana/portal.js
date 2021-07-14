import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import HTMLEmbed from '@/components/generic/HTMLEmbed.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData) => shallowMount(HTMLEmbed, {
  propsData: propsData || {
    html: '<iframe src=\'https://player.vimeo.com/video/112866269\' width=\'640\' height=\'360\' frameborder=\'0\' allow=\'autoplay; fullscreen\' allowfullscreen></iframe>'
  },
  localVue
});

describe('components/media/OEmbedMedia', () => {
  context('when there is something to embed', () => {
    it('has html', async() => {
      const wrapper = factory();
      const container = wrapper.find('[data-qa="html embed"]');

      container.contains('iframe').should.be.true;
    });
  });
  context('when there was a problem retrieving the embeded content', () => {
    it('has html', async() => {
      const errorMessage = 'Error: Request failed with status code 404';
      const wrapper = factory({ error: errorMessage });
      const container = wrapper.find('alertmessage-stub');
      container.attributes('error').should.eq(errorMessage);
    });
  });
});
