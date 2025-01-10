import { createLocalVue, shallowMount } from '@vue/test-utils';
import PageCookiesWidget from '@/components/page/PageCookiesWidget';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData) => shallowMount(PageCookiesWidget, {
  localVue,
  propsData: {
    klaroManager,
    ...propsData
  },
  mocks: {
    localePath: () => {},
    $n: (num) => num,
    $t: (key) => key,
    $tc: (key) => key
  },
  stubs: ['i18n']
});

const allServices = [
  {
    name: 'auth-strategy',
    purposes: ['essential'],
    required: true
  },
  {
    name: 'matomo',
    purposes: ['usage']
  },
  {
    name: 'facebook',
    purposes: ['thirdPartyContent', 'socialMedia']
  },
  {
    name: 'bookWidgets',
    purposes: ['thirdPartyContent', 'mediaViewing', '2D']
  }
];

const klaroConfig = { services: allServices };

const klaroManager = {
  changeAll: sinon.spy(),
  saveAndApplyConsents: sinon.spy(),
  updateConsent: sinon.spy(),
  config: klaroConfig
};

describe('components/page/PageCookiesWidget', () => {
  it('renders a toast as cookie notice', () => {
    const wrapper = factory();

    const cookieNoticeToast = wrapper.find('b-toast-stub');

    expect(cookieNoticeToast.isVisible()).toBe(true);
  });

  describe('when there are services defined in the Klaro config', () => {
    it('groups them into sections', () => {
      const wrapper = factory();

      expect(wrapper.vm.groupedSections[0].name).toEqual('essential');
      expect(wrapper.vm.groupedSections[1].name).toEqual('usage');
      expect(wrapper.vm.groupedSections[2].name).toEqual('thirdPartyContent');
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
    it('updates and saves the values to the klaro manager', () => {
      const wrapper = factory();

      wrapper.find('[data-qa="decline button"]').trigger('click');

      expect(klaroManager.changeAll.calledWith(false)).toBe(true);
      expect(klaroManager.saveAndApplyConsents.calledWith('decline')).toBe(true);
    });
  });

  describe('clicking the accept all button', () => {
    it('updates and saves the values to the klaro manager', () => {
      const wrapper = factory();

      wrapper.find('[data-qa="accept all button"]').trigger('click');

      expect(klaroManager.changeAll.calledWith(true)).toBe(true);
      expect(klaroManager.saveAndApplyConsents.calledWith('accept')).toBe(true);
    });
  });

  describe('clicking the accept selected button', () => {
    it('updates and saves the values to the klaro manager and hides the modal', () => {
      const wrapper = factory();
      wrapper.vm.$bvModal.hide = sinon.spy();

      wrapper.find('[data-qa="accept selected button"]').trigger('click');

      expect(klaroManager.saveAndApplyConsents.calledWith('save')).toBe(true);
      expect(wrapper.vm.$bvModal.hide.calledWith(wrapper.vm.modalId)).toBe(true);
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
      const wrapper = factory();

      expect(wrapper.vm.checkedServices).toEqual([allServices[0].name]);
    });
  });
});
