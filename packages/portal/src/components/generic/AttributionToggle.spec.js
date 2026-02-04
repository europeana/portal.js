import { createLocalVue, mount } from '@vue/test-utils';
import AttributionToggle from '@/components/generic/AttributionToggle.vue';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const attribution = {
  attribution: {
    name: 'Something',
    creator: 'Someone',
    provider: 'Somewhere',
    license: 'http://creativecommons.org/licenses/by-nd/4.0/',
    url: 'http://www.example.org/'
  }
};
const factory = (propsData = attribution) => mount(AttributionToggle, {
  localVue,
  attachTo: document.body,
  propsData,
  mocks: {
    $t: (key) => key
  },
  stubs: ['CiteAttribution']
});

describe('components/generic/AttributionToggle', () => {
  it('displays a toggle button', async() => {
    const wrapper = factory();

    const toggle = wrapper.find('[data-qa="toggle"]');

    expect(toggle.isVisible()).toBe(true);
  });
  it('does not display the attribution', async() => {
    const wrapper = factory();

    const attribution = wrapper.find('[data-qa="attribution"]');

    expect(attribution.exists()).toBe(false);
  });

  describe('when the toggle button is clicked', () => {
    it('displays the attribution', async() => {
      const wrapper = factory();

      wrapper.find('[data-qa="toggle"]').trigger('click');
      await wrapper.vm.$nextTick();
      const attribution = wrapper.find('[data-qa="attribution"]');

      expect(attribution.isVisible()).toBe(true);
    });
  });

  describe('when the toggle button is moused over', () => {
    const wrapper = factory();
    it('displays the attribution', async() => {
      wrapper.find('[data-qa="toggle"]').trigger('mouseover');
      await wrapper.vm.$nextTick();
      const attribution = wrapper.find('[data-qa="attribution"]');

      expect(attribution.isVisible()).toBe(true);
    });
    describe('and the mouse leaves', () => {
      it('removed the attribution and shows the toggle button', async() => {
        wrapper.find('[data-qa="attribution toggle"]').trigger('mouseleave');
        await wrapper.vm.$nextTick();
        const attribution = wrapper.find('[data-qa="attribution"]');
        const toggle = wrapper.find('[data-qa="toggle"]');

        expect(attribution.exists()).toBe(false);
        expect(toggle.isVisible()).toBe(true);
      });
    });
  });

  describe('when the toggle button is touched on touch device', () => {
    it('displays the attribution', async() => {
      const wrapper = factory();

      wrapper.find('[data-qa="toggle"]').trigger('touchstart');
      await wrapper.vm.$nextTick();
      const attribution = wrapper.find('[data-qa="attribution"]');

      expect(attribution.isVisible()).toBe(true);
    });
  });

  describe('when the attribution is open', () => {
    describe('and the escape key is pressed', () => {
      it('closes the attribution and displays and sets focus on the toggle button', async() => {
        const wrapper = factory();

        wrapper.find('[data-qa="toggle"]').trigger('click');
        await wrapper.vm.$nextTick();
        wrapper.find('[data-qa="attribution"]').trigger('keydown.escape.native');
        await wrapper.vm.$nextTick();

        const attribution = wrapper.find('[data-qa="attribution"]');
        const toggleWithFocus = wrapper.find('[data-qa="toggle"]:focus');

        expect(attribution.exists()).toBe(false);
        expect(toggleWithFocus.isVisible()).toBe(true);
      });
    });
    describe('and tabbing outside the attribution component', () => {
      it('closes the attribution and shows the toggle button', async() => {
        const wrapper = factory();
        wrapper.vm.$refs.attributiontoggle.contains = sinon.stub().returns(false);

        wrapper.find('[data-qa="toggle"]').trigger('click');
        await wrapper.vm.$nextTick();
        window.dispatchEvent(new KeyboardEvent('focusin'));
        await wrapper.vm.$nextTick();
        const attribution = wrapper.find('[data-qa="attribution"]');
        const toggle = wrapper.find('[data-qa="toggle"]');

        expect(attribution.exists()).toBe(false);
        expect(toggle.isVisible()).toBe(true);
      });
    });
  });

  describe('computed', () => {
    describe('rightsStatement', () => {
      it('favours attribution.rightsStatement', () => {
        const wrapper = factory({
          attribution: {
            ...attribution,
            rightsStatement: 'http://creativecommons.org/licenses/by-nd/4.0/'
          }
        });

        const rightsStatement = wrapper.vm.rightsStatement;

        expect(rightsStatement).toBe('http://creativecommons.org/licenses/by-nd/4.0/');
      });

      it('falls back to attribution.license', () => {
        const wrapper = factory();

        const rightsStatement = wrapper.vm.rightsStatement;

        expect(rightsStatement).toBe('http://creativecommons.org/licenses/by-nd/4.0/');
      });
    });
  });
});
