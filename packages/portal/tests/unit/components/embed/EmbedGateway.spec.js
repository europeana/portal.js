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

const factory = (propsData = { url }) => shallowMount(EmbedGateway, {
  localVue,
  propsData,
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
      delete servicesWithConsent.youTube;
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

    describe('when an embed code is passed', () => {
      describe('which contains an iframe', () => {
        it('sets the provider url to it\'s src and the width and height', () => {
          const iframeEmbedCode = '<div class="sketchfab-embed-wrapper"><iframe title="title" src="https://sketchfab.com/models/1234/embed" width="500" height="400"></iframe></div>';

          const wrapper = factory({ embedCode: iframeEmbedCode });

          expect(wrapper.vm.iframeDimensions.height).toEqual('400');
          expect(wrapper.vm.iframeDimensions.width).toEqual('500');
          expect(wrapper.vm.providerUrl).toEqual('https://sketchfab.com/models/1234/embed');
        });
      });

      describe('which contains a script', () => {
        it('sets the provider url to it\'s src', () => {
          const iframeEmbedCode = '<script async src="//www.instagram.com/embed.js"></script>';

          const wrapper = factory({ embedCode: iframeEmbedCode });

          expect(wrapper.vm.providerUrl).toEqual('http://www.instagram.com/embed.js');
        });
      });

      describe('which does not contains a script or iframe', () => {
        it('opens the gate', () => {
          const iframeEmbedCode = '<audio src="https://www.example.eu/audio.mp3"></audio>';

          const wrapper = factory({ embedCode: iframeEmbedCode });

          expect(wrapper.vm.opened).toBe(true);
        });
      });
    });
  });

  describe('when clicking the load all embedded content button', () => {
    it('updates, saves and applies consents and opens the embed', () => {
      const wrapper = factory();
      wrapper.vm.klaroManager = klaroManager;
      servicesWithConsent.youTube = true;

      wrapper.find('[data-qa="load all button"').trigger('click');

      expect(klaroManager.updateConsent.called).toBe(true);
      expect(klaroManager.saveAndApplyConsents.calledWith('save')).toBe(true);
      expect(wrapper.vm.opened).toBe(true);
      delete servicesWithConsent.youTube;
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
    it('updates, saves and applies consents and opens the embed', () => {
      const wrapper = factory();
      wrapper.vm.klaroManager = klaroManager;
      servicesWithConsent.youTube = true;

      wrapper.find('[data-qa="load only this provider button"').trigger('click');

      expect(klaroManager.updateConsent.called).toBe(true);
      expect(klaroManager.saveAndApplyConsents.calledWith('save')).toBe(true);
      expect(wrapper.vm.opened).toBe(true);
      delete servicesWithConsent.youTube;
    });
  });
});
