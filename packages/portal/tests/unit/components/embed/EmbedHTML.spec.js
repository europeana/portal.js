import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import EmbedHTML from '@/components/embed/EmbedHTML.vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const fixtures = {
  static: {
    width: 640,
    height: 480,
    html: '<iframe src="https://static.example.org/"></iframe>',
    title: 'Static example'
  },
  responsive: {
    responsive: true,
    width: 640,
    height: 480,
    html: '<iframe src="https://responsive.example.org/"></iframe>'
  }
};

const factory = (propsData = {}) => shallowMountNuxt(EmbedHTML, {
  propsData,
  localVue
});

describe('components/embed/EmbedHTML', () => {
  describe('when there is something to embed', () => {
    it('renders the html', () => {
      const wrapper = factory(fixtures.static);
      const iframe = wrapper.find('[data-qa="html embed"] iframe');

      expect(iframe.exists()).toBe(true);
    });

    describe('and there is a title supplied', () => {
      it('sets it on the iframe', () => {
        const wrapper = factory(fixtures.static);
        const iframe = wrapper.find('[data-qa="html embed"] iframe');

        expect(iframe.attributes('title')).toBe(fixtures.static.title);
      });
    });
  });

  describe('responsive embed wrapper', () => {
    it('is used when responsive is `true` and height and width are present', () => {
      const wrapper = factory(fixtures.responsive);

      const iframe = wrapper.find('[data-qa="responsive embed wrapper"] [data-qa="html embed"] iframe');
      expect(iframe.exists()).toBe(true);
    });

    describe('width', () => {
      it('sets a width for the wrapper', () => {
        const wrapper = factory(fixtures.responsive);

        wrapper.vm.mounted();
        const responsive = wrapper.find('[data-qa="responsive embed wrapper"]');
        expect(responsive.attributes('style')).toBe('width: 0px;');
      });

      it('is recalculated on window resize', () => {
        jest.useFakeTimers();
        const wrapper = factory(fixtures.responsive);
        sinon.spy(wrapper.vm, 'setWidthWrapper');

        wrapper.vm.mounted();
        jest.advanceTimersByTime(900);
        window.dispatchEvent(new Event('resize'));

        expect(wrapper.vm.setWidthWrapper.called).toBe(true);
      });
    });
  });
});
