import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import ContentWarningModal from '@/components/generic/ContentWarningModal.vue';

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
    $path: () => '/',
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

describe('components/generic/ContentWarning', () => {
  context('in browser', () => {
    beforeEach(() => {
      process.browser = true;
      global.sessionStorage = { dismissedWarnings: '["blog/already-viewed"]' };
    });

    afterEach(() => {
      process.browser = false;
    });

    describe('showWarning', () => {
      context('when not shown before', () => {
        it('uses bvModal to show a warning', () => {
          const wrapper = factory(props);
          const bvModalShow = sinon.spy(wrapper.vm.$bvModal, 'show');

          wrapper.vm.showWarning();
          bvModalShow.should.have.been.calledWith('content-warning-modal');
        });
        it('tracks the show event in Matomo', () => {
          const wrapper = factory(props);

          wrapper.vm.showWarning();
          wrapper.vm.$matomo.trackEvent.should.have.been.calledWith('Content warning', 'Content warning modal shows', 'exhibition/slug-example');
        });
      });
      context('when shown before and dismissed', () => {
        it('does not show a warning', () => {
          global.sessionStorage = { dismissedWarnings: '["exhibition/slug-example"]' };
          const wrapper = factory(props);
          const bvModalShow = sinon.spy(wrapper.vm.$bvModal, 'show');

          wrapper.vm.showWarning();
          bvModalShow.should.not.have.been.calledWith('content-warning-modal');
        });
      });
    });

    describe('Go away button', () => {
      it('tracks the go away event in Matomo', () => {
        const wrapper = factory(props);
        const awayButton = wrapper.find('[data-qa="go away button"]');

        awayButton.trigger('click');
        wrapper.vm.$matomo.trackEvent.should.have.been.calledWith('Content warning', 'Click go away', 'exhibition/slug-example');
      });
    });

    describe('dismissWarning', () => {
      it('uses bvModal to hide the warning and sets sessionstorage', () => {
        const wrapper = factory(props);
        const bvModalHide = sinon.spy(wrapper.vm.$bvModal, 'hide');

        wrapper.vm.dismissWarning();
        bvModalHide.should.have.been.calledWith('content-warning-modal');
        global.sessionStorage.dismissedWarnings.should.eq('["blog/already-viewed","exhibition/slug-example"]');
      });
      it('tracks the continue event in Matomo', () => {
        const wrapper = factory(props);

        wrapper.vm.dismissWarning();
        wrapper.vm.$matomo.trackEvent.should.have.been.calledWith('Content warning', 'Click continue', 'exhibition/slug-example');
      });
    });
  });
});
