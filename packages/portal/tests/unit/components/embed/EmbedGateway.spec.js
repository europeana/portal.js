import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import EmbedGateway from '@/components/embed/EmbedGateway';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const url = 'https://youtu.be/example';
const servicesWithConsent = { 'auth-strategy': true };
const klaroManager = {
  changeAll: sinon.spy(),
  loadConsents: sinon.stub().returns(servicesWithConsent),
  saveAndApplyConsents: sinon.spy(),
  updateConsent: sinon.spy(),
  confirmed: true
};

const factory = () => shallowMount(EmbedGateway, {
  localVue,
  propsData: {
    url
  },
  mocks: {

    $t: (key) => key,
    $features: { embeddedMediaNotification: true },
    $i18n: {
      locale: 'en'
    }
  },
  slots: { default: '<div class="embed"/>' },
  stubs: ['i18n', 'MediaCardImage', 'PageCookiesWidget']
});

describe('components/embed/EmbedGateway', () => {
  describe('when not opened', () => {
    it('renders a notification overlay', () => {
      const wrapper = factory();

      const notification =  wrapper.find('.notification-overlay');

      expect(notification.isVisible()).toBe(true);
    });
  });

  describe('when provider has user consent', () => {
    it('renders the embed', async() => {
      servicesWithConsent.youTube = true;
      const wrapper = factory();
      wrapper.vm.klaroManager = klaroManager;

      await wrapper.vm.$nextTick();

      const notification =  wrapper.find('.notification-overlay');
      const embed = wrapper.find('.embed');

      expect(notification.exists()).toBe(false);
      expect(embed.isVisible()).toBe(true);
    });
  });

  describe('on mounted', () => {
    it('looks up the service for the embed URL', () => {
      const wrapper = factory();

      expect(wrapper.vm.provider.name).toEqual('youTube');
    });

    describe('when a provider is found in the whitelist', () => {
      it('updates the provider name translation string', () => {
        const wrapper = factory();

        expect(wrapper.vm.providerName).toEqual('klaro.services.youTube.title');
      });
    });
  });

  describe('when clicking the load all embedded content button', () => {
    it('updates, saves and applies consents', () => {
      const wrapper = factory();
      wrapper.vm.klaroManager = klaroManager;

      wrapper.find('[data-qa="load all button"').trigger('click');

      expect(klaroManager.updateConsent.called).toBe(true);
      expect(klaroManager.saveAndApplyConsents.calledWith('save')).toBe(true);
    });
  });

  describe('when clicking the view full list button', () => {
    it('opens the third-party-content modal', () => {
      const wrapper = factory();
      sinon.spy(wrapper.vm.$bvModal, 'show');

      wrapper.find('[data-qa="view full list button"').trigger('click');

      expect(wrapper.vm.renderCookieModal).toEqual(true);
      expect(wrapper.vm.$bvModal.show.calledWith('embed-cookie-modal')).toBe(true);
    });
  });

  describe('when clicking the load only this provider button', () => {
    it('updates, saves and applies consents', () => {
      const wrapper = factory();
      wrapper.vm.klaroManager = klaroManager;

      wrapper.find('[data-qa="load only this provider button"').trigger('click');

      expect(klaroManager.updateConsent.called).toBe(true);
      expect(klaroManager.saveAndApplyConsents.calledWith('save')).toBe(true);
    });
  });
});
