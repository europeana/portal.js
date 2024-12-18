import { createLocalVue, shallowMount } from '@vue/test-utils';
import PageCookiesWidget from '@/components/page/PageCookiesWidget';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData) => shallowMount(PageCookiesWidget, {
  localVue,
  propsData,
  mocks: {
    localePath: () => {},
    $n: (num) => num,
    $t: (key) => key,
    $tc: (key) => key
  },
  stubs: ['i18n']
});

const klaroManager = {
  changeAll: sinon.spy(),
  saveAndApplyConsents: sinon.spy(),
  updateConsent: sinon.spy()
};

const allTypesOfServices = [
  { name: 'auth-strategy',
    purposes: ['essential'],
    required: true },
  { name: 'matomo',
    purposes: ['usage'] },
  { name: 'facebook',
    purposes: ['thirdPartyContent'],
    subPurpose: 'socialMedia' },
  { name: 'bookWidgets',
    purposes: ['thirdPartyContent'],
    subPurpose: 'mediaViewing',
    subGroup: '2D' }
];

const klaroConfig = { services: allTypesOfServices };

describe('components/page/PageCookiesWidget', () => {
  it('renders a toast as cookie notice', () => {
    const wrapper = factory();

    const cookieNoticeToast = wrapper.find('b-toast-stub');

    expect(cookieNoticeToast.isVisible()).toBe(true);
  });

  describe('when there are services defined in the Klaro config', () => {
    it('groups them by purpose, subpurpose and subgroup', () => {
      const wrapper = factory({ klaroConfig });

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

      wrapper.find('b-toast-stub .btn-link').trigger('click');

      expect(wrapper.vm.$bvModal.show.calledWith(wrapper.vm.modalId)).toBe(true);
      expect(wrapper.vm.$bvToast.hide.calledWith(wrapper.vm.toastId)).toBe(true);
    });
  });

  describe('clicking the decline button', () => {
    it('updates and saves the values to the klaro manager', () => {
      const wrapper = factory({ klaroConfig, klaroManager });

      wrapper.find('[data-qa="decline button"]').trigger('click');

      expect(klaroManager.changeAll.calledWith(false)).toBe(true);
      expect(klaroManager.saveAndApplyConsents.calledWith('decline')).toBe(true);
    });
  });

  describe('clicking the accept all button', () => {
    it('updates and saves the values to the klaro manager', () => {
      const wrapper = factory({ klaroConfig, klaroManager });

      wrapper.find('[data-qa="accept all button"]').trigger('click');

      expect(klaroManager.changeAll.calledWith(true)).toBe(true);
      expect(klaroManager.saveAndApplyConsents.calledWith('accept')).toBe(true);
    });
  });

  describe('clicking the accept selected button', () => {
    it('updates and saves the values to the klaro manager and hides the modal', () => {
      const wrapper = factory({ klaroConfig, klaroManager });
      wrapper.vm.$bvModal.hide = sinon.spy();

      wrapper.find('[data-qa="accept selected button"]').trigger('click');

      expect(klaroManager.saveAndApplyConsents.calledWith('save')).toBe(true);
      expect(wrapper.vm.$bvModal.hide.calledWith(wrapper.vm.modalId)).toBe(true);
    });
  });

  describe('clicking the services display button', () => {
    it('toggles the show state', () => {
      const wrapper = factory({ klaroConfig });

      wrapper.find('[data-qa="toggle display button"]').trigger('click');

      expect(wrapper.vm.show).toEqual(['thirdPartyContent', 'essential']);

      wrapper.find('[data-qa="toggle display button"]').trigger('click');

      expect(wrapper.vm.show).toEqual(['thirdPartyContent']);
    });
  });

  describe('when the modal is hidden', () => {
    describe('and cookie consent is still required', () => {
      it('opens the cookie notie toast', () => {
        const wrapper = factory();
        wrapper.vm.$bvToast.show = sinon.spy();

        wrapper.vm.onModalHide();

        expect(wrapper.vm.$bvToast.show.calledWith(wrapper.vm.toastId)).toBe(true);
      });
    });
  });

  describe('on mounted', () => {
    it('adds the required services to checked services', () => {
      const wrapper = factory({ klaroConfig });

      expect(wrapper.vm.checkedServices).toEqual([allTypesOfServices[0]]);
    });
  });

  describe('methods', () => {
    describe('updateConsentPerService', () => {
      describe('when the service is falsy or required', () => {
        it('does not updates the consent in the Klaro manager and in local state in checkedServices', () => {
          const wrapper = factory({ klaroConfig, klaroManager });

          const requiredService = allTypesOfServices[0];
          wrapper.vm.updateConsentPerService(requiredService, true);

          expect(klaroManager.updateConsent.called).toBe(false);
          expect(wrapper.vm.checkedServices.includes(requiredService)).toBe(true);

          wrapper.vm.updateConsentPerService(null, true);

          expect(klaroManager.updateConsent.called).toBe(false);
        });
      });
      describe('when the service is truthy and not required', () => {
        it('updates the consent in the Klaro manager and in local state in checkedServices', () => {
          const wrapper = factory({ klaroConfig, klaroManager });

          const service = allTypesOfServices[1];
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
        const wrapper = factory({ klaroConfig, klaroManager });

        const purpose = wrapper.vm.groupedPurposes[1];
        wrapper.vm.updateConsentPerPurpose(purpose, true);

        expect(klaroManager.updateConsent.called).toBe(true);
      });
    });
  });
});
