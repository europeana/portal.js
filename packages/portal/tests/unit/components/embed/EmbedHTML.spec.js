import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import EmbedHTML from '@/components/embed/EmbedHTML.vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const script = '<script src="https://www.example.eu/script.js" onload="console.log(`loaded`)" crossorigin="anonymous"></script>';
const inlineScript = '<script>console.log("This is an inline test script")</script>';
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
  },
  script: {
    html: `<span></span>${script}`
  },
  inlineScript: {
    html: `<span></span>${inlineScript}`
  },
  multipleScripts: {
    html: `<span></span>${script}${inlineScript}`
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

  describe('when embed contains scripts', () => {
    it('makes a copy of each script and adds it after embed container', () => {
      const wrapper = factory(fixtures.script);
      sinon.spy(wrapper.vm.$refs.embedContainer, 'after');
      wrapper.vm.mounted();

      expect(wrapper.vm.$refs.embedContainer.after.called).toBe(true);
      expect(wrapper.vm.$el.innerHTML).toEqual(fixtures.script.html);
      expect(wrapper.vm.embedCode).not.toContain(script);
    });
    describe('and script is an inline script', () => {
      it('makes a copy of each script and adds it after embed container', () => {
        const wrapper = factory(fixtures.inlineScript);
        sinon.spy(wrapper.vm.$refs.embedContainer, 'after');
        wrapper.vm.mounted();
        expect(wrapper.vm.$refs.embedContainer.after.called).toBe(true);
        expect(wrapper.vm.$el.innerHTML).toEqual(fixtures.inlineScript.html);
        expect(wrapper.vm.embedCode).not.toContain(inlineScript);
      });
    });
    describe('and there are multiple scripts', () => {
      it('makes a copy of each script and adds it after embed container', () => {
        const wrapper = factory(fixtures.multipleScripts);
        sinon.spy(wrapper.vm.$refs.embedContainer, 'after');
        wrapper.vm.mounted();
        expect(wrapper.vm.$refs.embedContainer.after.called).toBe(true);
        expect(wrapper.vm.$el.innerHTML).toEqual(fixtures.multipleScripts.html);
        expect(wrapper.vm.embedCode).not.toContain(script);
      });
    });
  });
});
