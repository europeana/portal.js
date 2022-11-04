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
    html: '<iframe src="https://static.example.org/"></iframe>'
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
  localVue,
  mocks: {
    $fetchState: {}
  }
});

describe('components/embed/EmbedHTML', () => {
  describe('when there is something to embed', () => {
    it('has an iframe', () => {
      const wrapper = factory(fixtures.static);
      const iframe = wrapper.find('[data-qa="html embed"] iframe');

      expect(iframe.exists()).toBe(true);
    });
  });

  describe('responsive embed wrapper', () => {
    it('is used when responsive is `true` and height and width are present', () => {
      const wrapper = factory(fixtures.responsive);

      const iframe = wrapper.find('[data-qa="responsive embed wrapper"] [data-qa="html embed"] iframe');
      expect(iframe.exists()).toBe(true);
    });

    describe('max width', () => {
      it('sets a max width for the wrapper', () => {
        const wrapper = factory(fixtures.responsive);

        wrapper.vm.mounted();
        const responsive = wrapper.find('[data-qa="responsive embed wrapper"]');
        expect(responsive.attributes('style')).toBe('max-width: 0px;');
      });

      it('is recalculated on window resize', () => {
        jest.useFakeTimers();
        const wrapper = factory(fixtures.responsive);
        sinon.spy(wrapper.vm, 'setMaxWidthWrapper');

        wrapper.vm.mounted();
        jest.advanceTimersByTime(900);
        window.dispatchEvent(new Event('resize'));

        expect(wrapper.vm.setMaxWidthWrapper.called).toBe(true);
      });
    });
  });
});
