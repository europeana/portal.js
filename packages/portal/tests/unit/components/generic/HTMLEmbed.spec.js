import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import HTMLEmbed from '@/components/generic/HTMLEmbed.vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const fixtures = {
  soundcloud: {
    provider: 'SoundCloud',
    width: 400,
    height: 400,
    html: '<iframe width="100%" height="400" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F529326333&show_artwork=true"></iframe>'
  },
  vimeo: {
    provider: 'Vimeo',
    width: 640,
    height: 360,
    html: '<iframe src="https://player.vimeo.com/video/112866269" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>'
  },
  youtube: {
    provider: 'YouTube',
    width: 200,
    height: 150,
    html: '<iframe width="200" height="150" src="https://www.youtube.com/embed/cwHVie7GpNw?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
  }
};

const factory = (propsData = {}) => shallowMountNuxt(HTMLEmbed, {
  propsData,
  localVue
});

describe('components/media/HTMLEmbed', () => {
  describe('when there is something to embed', () => {
    it('has an iframe', () => {
      const wrapper = factory(fixtures.vimeo);
      const iframe = wrapper.find('[data-qa="html embed"] iframe');

      expect(iframe.exists()).toBe(true);
    });
  });

  describe('when there was a problem retrieving the embedded content', () => {
    it('has the error message', () => {
      const errorMessage = 'Error: Request failed with status code 404';
      const wrapper = factory({ error: errorMessage });
      const container = wrapper.find('alertmessage-stub');

      expect(container.attributes('error')).toBe(errorMessage);
    });
  });

  describe('responsive embed wrapper', () => {
    it('is used for YouTube embeds', () => {
      const wrapper = factory(fixtures.youtube);

      const iframe = wrapper.find('[data-qa="responsive embed wrapper"] [data-qa="html embed"] iframe');
      expect(iframe.exists()).toBe(true);
    });

    it('is used for Vimeo embeds', () => {
      const wrapper = factory(fixtures.vimeo);

      const iframe = wrapper.find('[data-qa="responsive embed wrapper"] [data-qa="html embed"] iframe');
      expect(iframe.exists()).toBe(true);
    });

    it('is not used for SoundCloud embeds', () => {
      const wrapper = factory(fixtures.soundcloud);

      const iframe = wrapper.find('[data-qa="html embed"] iframe');
      expect(iframe.exists()).toBe(true);

      const responsive = wrapper.find('[data-qa="responsive embed wrapper"]');
      expect(responsive.exists()).toBe(false);
    });

    describe('max width', () => {
      it('sets a max width for the wrapper', () => {
        const wrapper = factory(fixtures.vimeo);

        wrapper.vm.mounted();
        const responsive = wrapper.find('[data-qa="responsive embed wrapper"]');
        expect(responsive.attributes('style')).toBe('max-width: 0px;');
      });

      it('is recalculated on window resize', () => {
        const wrapper = factory(fixtures.vimeo);
        sinon.spy(wrapper.vm, 'setMaxWidthWrapper');

        wrapper.vm.mounted();
        window.dispatchEvent(new Event('resize'));

        expect(wrapper.vm.setMaxWidthWrapper.called).toBe(true);
      });
    });
  });
});
