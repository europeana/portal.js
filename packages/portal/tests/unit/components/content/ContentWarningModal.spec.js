import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import ContentWarningModal from '@/components/content/ContentWarningModal.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData = {}) => mount(ContentWarningModal, {
  localVue,
  propsData: {
    modalStatic: true,
    ...propsData
  },
  mocks: {
    $t: (val) => val,
    localePath: () => '/',
    $matomo: {
      trackEvent: sinon.spy()
    }
  }
});

const props = {
  title: 'This is a content warning',
  description: 'This is a warning description',
  pageSlug: 'exhibition/slug-example'
};

describe('components/content/ContentWarning', () => {
  describe('in browser', () => {
    beforeEach(() => {
      process.browser = true;
      global.sessionStorage.setItem('dismissedWarnings', '["story/already-viewed"]');
    });

    afterEach(() => {
      process.browser = false;
    });

    describe('showWarning', () => {
      describe('when not shown before', () => {
        it('uses bvModal to show a warning', () => {
          const wrapper = factory(props);
          const bvModalShow = sinon.spy(wrapper.vm.$bvModal, 'show');

          wrapper.vm.showWarning();
          expect(bvModalShow.calledWith('content-warning-modal')).toBe(true);
        });
        it('tracks the show event in Matomo', () => {
          const wrapper = factory(props);

          wrapper.vm.showWarning();
          expect(wrapper.vm.$matomo.trackEvent.calledWith('Content warning', 'Content warning modal shows', 'exhibition/slug-example')).toBe(true);
        });
      });
      describe('when shown before and dismissed', () => {
        it('does not show a warning', () => {
          global.sessionStorage.setItem('dismissedWarnings', '["exhibition/slug-example"]');
          const wrapper = factory(props);
          const bvModalShow = sinon.spy(wrapper.vm.$bvModal, 'show');

          wrapper.vm.showWarning();
          expect(bvModalShow.calledWith('content-warning-modal')).toBe(false);
        });
      });
    });

    describe('Go away button', () => {
      it('tracks the go away event in Matomo', () => {
        const wrapper = factory(props);
        const awayButton = wrapper.find('[data-qa="go away button"]');

        awayButton.trigger('click');
        expect(wrapper.vm.$matomo.trackEvent.calledWith('Content warning', 'Click go away', 'exhibition/slug-example')).toBe(true);
      });
    });

    describe('dismissWarning', () => {
      it('uses bvModal to hide the warning and sets sessionstorage', () => {
        const wrapper = factory(props);
        const bvModalHide = sinon.spy(wrapper.vm.$bvModal, 'hide');

        wrapper.vm.dismissWarning();
        expect(bvModalHide.calledWith('content-warning-modal')).toBe(true);
        expect(global.sessionStorage.getItem('dismissedWarnings')).toBe('["story/already-viewed","exhibition/slug-example"]');
      });
      it('tracks the continue event in Matomo', () => {
        const wrapper = factory(props);

        wrapper.vm.dismissWarning();
        expect(wrapper.vm.$matomo.trackEvent.calledWith('Content warning', 'Click continue', 'exhibition/slug-example')).toBe(true);
      });
    });
  });
});
