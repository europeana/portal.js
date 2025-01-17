import { createLocalVue, shallowMount } from '@vue/test-utils';
import PageCookiesWidget from '@/components/page/PageCookiesWidget';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData = {}) => shallowMount(PageCookiesWidget, {
  localVue,
  propsData: {
    ...propsData
  },
  data: () => {
    return {
      klaroManager
    };
  },
  mocks: {
    localePath: () => {},
    $features: { embeddedMediaNotification: true },
    $i18n: { locale: 'en ' },
    $matomo: {
      trackEvent: sinon.spy()
    },
    $n: (num) => num,
    $t: (key) => key,
    $tc: (key) => key
  },
  stubs: ['i18n']
});

const klaroManager = {
  changeAll: sinon.spy(),
  loadConsents: sinon.stub().returns({ 'auth-strategy': true }),
  saveAndApplyConsents: sinon.spy(),
  updateConsent: sinon.spy()
};

describe('components/page/PageCookiesWidget', () => {
  afterEach(sinon.resetHistory);

  it('renders a toast as cookie notice', () => {
    const wrapper = factory();

    const cookieNoticeToast = wrapper.find('b-toast-stub');

    expect(cookieNoticeToast.isVisible()).toBe(true);
  });

  describe('when there are services defined in the Klaro config', () => {
    it('groups them by purpose, subpurpose and subgroup', () => {
      const wrapper = factory();

      expect(wrapper.vm.groupedPurposes[0].name).toEqual('essential');
      expect(wrapper.vm.groupedPurposes[1].name).toEqual('usage');
      expect(wrapper.vm.groupedPurposes[2].name).toEqual('thirdPartyContent');
    });
  });

  describe('clicking the learn more link', () => {
    it('opens the cookie modal and hides the toast', () => {
      const wrapper = factory();
      wrapper.vm.$bvModal.show = sinon.spy();
      wrapper.vm.$bvToast.hide = sinon.spy();

      wrapper.find('[data-qa="learn more button"]').trigger('click');

      expect(wrapper.vm.$bvModal.show.calledWith(wrapper.vm.modalId)).toBe(true);
      expect(wrapper.vm.$bvToast.hide.calledWith(wrapper.vm.toastId)).toBe(true);
    });
  });

  describe('clicking the decline button', () => {
    it('updates and saves the values to the klaro manager and tracks the event in Matomo', () => {
      const wrapper = factory();

      wrapper.find('[data-qa="decline button"]').trigger('click');

      expect(klaroManager.changeAll.calledWith(false)).toBe(true);
      expect(klaroManager.saveAndApplyConsents.calledWith('decline')).toBe(true);
      expect(wrapper.vm.$matomo.trackEvent.calledWith('main cookie widget', 'Save cookie preferences', 'Decline')).toBe(true);
      expect(wrapper.vm.$matomo.trackEvent.calledWith('Klaro', 'Clicked', 'Decline')).toBe(true);
    });
  });

  describe('clicking the accept all button', () => {
    it('updates and saves the values to the klaro manager and tracks the event in Matomo', () => {
      const wrapper = factory();

      wrapper.find('[data-qa="accept all button"]').trigger('click');

      expect(klaroManager.changeAll.calledWith(true)).toBe(true);
      expect(klaroManager.saveAndApplyConsents.calledWith('accept')).toBe(true);
      expect(wrapper.vm.$matomo.trackEvent.calledWith('main cookie widget', 'Save cookie preferences', 'Okay/Accept all')).toBe(true);
      expect(wrapper.vm.$matomo.trackEvent.calledWith('Klaro', 'Clicked', 'Okay/Accept all')).toBe(true);
    });
  });

  describe('clicking the accept selected button', () => {
    it('updates and saves the values to the klaro manager, hides the modal and tracks the event in Matomo', () => {
      const wrapper = factory();
      wrapper.vm.$bvModal.hide = sinon.spy();

      wrapper.find('[data-qa="accept selected button"]').trigger('click');

      expect(klaroManager.saveAndApplyConsents.calledWith('save')).toBe(true);
      expect(wrapper.vm.$bvModal.hide.calledWith(wrapper.vm.modalId)).toBe(true);
      expect(wrapper.vm.$matomo.trackEvent.calledWith('main cookie widget', 'Save cookie preferences', 'Accept selected')).toBe(true);
      expect(wrapper.vm.$matomo.trackEvent.calledWith('Klaro', 'Clicked', 'Accept selected')).toBe(true);
    });
  });

  describe('clicking the services display button', () => {
    it('toggles the show state', () => {
      const wrapper = factory();

      wrapper.find('[data-qa="toggle display button"]').trigger('click');

      expect(wrapper.vm.show).toEqual(['thirdPartyContent', 'essential']);

      wrapper.find('[data-qa="toggle display button"]').trigger('click');

      expect(wrapper.vm.show).toEqual(['thirdPartyContent']);
    });
  });

  describe('when the modal is hidden', () => {
    describe('and cookie consent is still required', () => {
      it('opens the cookie notice toast', () => {
        const wrapper = factory();
        wrapper.vm.$bvToast.show = sinon.spy();

        wrapper.vm.onModalHide();

        expect(wrapper.vm.$bvToast.show.calledWith(wrapper.vm.toastId)).toBe(true);
      });
    });
  });

  describe('when rendered as the embed cookie modal', () => {
    const embedCookieModalProps = {
      renderToast: false,
      modalId: 'embed-cookie-modal',
      hidePurposes: ['essential', 'usage']
    };

    it('renders the modal and not a toast', () => {
      const wrapper = factory(embedCookieModalProps);

      const cookieNoticeToast = wrapper.find('b-toast-stub');
      const embedCookieModal = wrapper.find('b-modal-stub');

      expect(cookieNoticeToast.exists()).toBe(false);
      expect(embedCookieModal.isVisible()).toBe(true);
    });

    describe('clicking the accept all button', () => {
      it('updates and saves the values to the klaro manager and tracks the event in Matomo', () => {
        const wrapper = factory(embedCookieModalProps);

        wrapper.find('[data-qa="accept all button"]').trigger('click');

        expect(klaroManager.changeAll.called).toBe(false);
        expect(klaroManager.saveAndApplyConsents.calledWith('save')).toBe(true);
        expect(wrapper.vm.$matomo.trackEvent.calledWith('third party content modal', 'Save cookie preferences', 'Okay/Accept all')).toBe(true);
        expect(wrapper.vm.$matomo.trackEvent.calledWith('Klaro', 'Clicked', 'Okay/Accept all')).toBe(true);
      });
    });
  });

  describe('on mounted', () => {
    it('adds the required services to checked services', () => {
      const wrapper = factory();

      const requiredService = wrapper.vm.klaroConfig.services.find((s) => s.required);

      expect(wrapper.vm.checkedServices.includes(requiredService)).toBe(true);
    });
  });

  describe('methods', () => {
    describe('updateConsentPerService', () => {
      describe('when the service is falsy or required', () => {
        it('does not updates the consent in the Klaro manager and in local state in checkedServices', () => {
          const wrapper = factory();

          const requiredService = wrapper.vm.klaroConfig.services.find((s) => s.required);

          wrapper.vm.updateConsentPerService(requiredService, true);

          expect(klaroManager.updateConsent.called).toBe(false);
          expect(wrapper.vm.checkedServices.includes(requiredService)).toBe(true);

          wrapper.vm.updateConsentPerService(null, true);

          expect(klaroManager.updateConsent.called).toBe(false);
        });
      });
      describe('when the service is truthy and not required', () => {
        it('updates the consent in the Klaro manager and in local state in checkedServices', () => {
          const wrapper = factory();

          const service = wrapper.vm.klaroConfig.services.find((s) => !s.required);
          wrapper.vm.updateConsentPerService(service, true);

          expect(klaroManager.updateConsent.calledWith(service.name, true)).toBe(true);
          expect(wrapper.vm.checkedServices.includes(service)).toBe(true);

          wrapper.vm.updateConsentPerService(service, false);

          expect(klaroManager.updateConsent.calledWith(service.name, false)).toBe(true);
          expect(wrapper.vm.checkedServices.includes(service)).toBe(false);
        });
      });
    });

    describe('updateConsentPerPurpose', () => {
      it('updates the consent for each purpose\'s service', () => {
        const wrapper = factory();

        const purpose = wrapper.vm.groupedPurposes[1];
        wrapper.vm.updateConsentPerPurpose(purpose, true);

        expect(klaroManager.updateConsent.called).toBe(true);
      });
    });
  });
});
