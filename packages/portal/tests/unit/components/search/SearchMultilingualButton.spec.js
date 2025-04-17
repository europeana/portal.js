import { createLocalVue, shallowMount } from '@vue/test-utils';
import SearchMultilingualButton from '@/components/search/SearchMultilingualButton';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ mocks = {}, propsData = {} } = {}) => shallowMount(SearchMultilingualButton, {
  attachTo: document.body,
  localVue,
  mocks: {
    $auth: { loggedIn: false },
    $t: (key) => key,
    $matomo: {
      trackEvent: sinon.stub()
    },
    $i18n: {
      locales: [
        {
          code: 'en',
          name: 'English'
        },
        {
          code: 'es',
          name: 'Español'
        }
      ],
      locale: 'es'
    },
    ...mocks
  },
  propsData,
  stubs: ['NewFeatureTooltip']
});

describe('components/search/SearchMultilingualButton', () => {
  beforeEach(() => {
    sinon.resetHistory();
  });
  it('renders a button in non-enabled state', () => {
    const wrapper = factory();

    const button = wrapper.find('.search-multilingual-button');

    expect(button.attributes('aria-label')).toBe('search.multilingual.enable');
  });

  describe('when clicked', () => {
    describe('and user is not logged in', () => {
      describe('and click is not a touch tap', () => {
        it('emits the input event to toggle the selected state on; matomo tracks', () => {
          const wrapper = factory();

          const button = wrapper.find('.search-multilingual-button');
          button.trigger('click');

          expect(wrapper.emitted('input')).toEqual([[true]]);
          expect(wrapper.vm.$matomo.trackEvent.calledWith('Multilingual search', 'Enabled multilingual search', 'Español multilingual search toggle')).toBe(true);
        });
      });

      describe('and click is from a touch interaction', () => {
        it('does not emit the input event, but increases the touchTap count by 1; does not matomo track', () => {
          const wrapper = factory();

          const button = wrapper.find('.search-multilingual-button');
          button.trigger('touchstart');
          button.trigger('click');

          expect(wrapper.vm.touchTapCount).toEqual(1);
          expect(wrapper.emitted('input')).toBeUndefined();
          expect(wrapper.vm.$matomo.trackEvent.called).toBe(false);
        });

        describe('on a second click', () => {
          it('emits the input event and resets the touchTapCount to 0; matomo tracks', () => {
            const wrapper = factory();

            const button = wrapper.find('.search-multilingual-button');
            button.trigger('touchstart');
            button.trigger('click');

            expect(wrapper.vm.touchTapCount).toEqual(1);
            expect(wrapper.emitted('input')).toBeUndefined();

            button.trigger('touchstart');
            button.trigger('click');

            expect(wrapper.emitted('input')).toEqual([[true]]);
            expect(wrapper.vm.$matomo.trackEvent.calledWith('Multilingual search', 'Enabled multilingual search', 'Español multilingual search toggle')).toBe(true);
            expect(wrapper.vm.touchTapCount).toEqual(0);
          });
        });
      });
    });

    describe('and user is logged in', () => {
      const mocks = { $auth: { loggedIn: true } };

      describe('when multilingual results are enabled', () => {
        const propsData = { value: true };

        describe('and click is not a touch tap', () => {
          it('emits the input event to toggle the selected state and hides the tooltip', async() => {
            const wrapper = factory({ mocks, propsData });

            const button = wrapper.find('.search-multilingual-button');
            button.trigger('click');
            await wrapper.vm.$nextTick();

            expect(wrapper.vm.$matomo.trackEvent.calledWith('Multilingual search', 'Disabled multilingual search', 'Español multilingual search toggle')).toBe(true);
            expect(wrapper.emitted('input')).toEqual([[false]]);
            expect(wrapper.vm.showTooltip).toEqual(false);
          });
        });

        describe('and click is from a touch interaction', () => {
          it('emits the input event to toggle the selected state and hides the tooltip', async() => {
            const wrapper = factory({ mocks, propsData });

            const button = wrapper.find('.search-multilingual-button');
            button.trigger('touchstart');
            button.trigger('click');
            await wrapper.vm.$nextTick();

            expect(button.attributes('aria-label')).toBe('search.multilingual.disable');
            expect(wrapper.emitted('input')).toEqual([[false]]);
            expect(wrapper.vm.showTooltip).toEqual(false);
          });
        });
      });

      describe('when multilingual results are disabled', () => {
        const propsData = { value: false };

        it('emits the input event to toggle the selected state on', () => {
          const wrapper = factory({ mocks, propsData });

          const button = wrapper.find('.search-multilingual-button');
          button.trigger('click');

          expect(wrapper.vm.$matomo.trackEvent.calledWith('Multilingual search', 'Enabled multilingual search', 'Español multilingual search toggle')).toBe(true);
          expect(wrapper.emitted('input')).toEqual([[true]]);
        });
      });
    });
  });
});
