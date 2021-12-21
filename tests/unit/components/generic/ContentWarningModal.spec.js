import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import ContentWarningModal from '@/components/generic/ContentWarningModal.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData = {}) => mount(ContentWarningModal, {
  localVue,
  propsData,
  mocks: {
    $t: (val) => val,
    $path: () => '/'
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
      });
      context('when shown before', () => {
        it('uses bvModal to show a warning', () => {
          global.sessionStorage = { dismissedWarnings: '["exhibition/slug-example"]' };
          const wrapper = factory(props);
          const bvModalShow = sinon.spy(wrapper.vm.$bvModal, 'show');

          wrapper.vm.showWarning();
          bvModalShow.should.not.have.been.calledWith('content-warning-modal');
        });
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
    });
  });
});
