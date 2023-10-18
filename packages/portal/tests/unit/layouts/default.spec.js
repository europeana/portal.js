import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import layout from '@/layouts/default';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const nuxtI18nHead = {
  htmlAttrs: { lang: 'en-GB' },
  link: [{
    hid: 'i18n-alt-bg',
    rel: 'alternate',
    href: 'https://www.europeana.eu/bg',
    hreflang: 'bg'
  }],
  meta: [{
    hid: 'i18n-og',
    property: 'og:locale',
    content: 'en_GB'
  }]
};

const storeCommitStub = sinon.spy();

const factory = (options = {}) => shallowMountNuxt(layout, {
  localVue,
  data() {
    return options.data || {};
  },
  mocks: {
    $store: {
      state: {
        breadcrumb: {},
        navigation: {
          browserNative: options?.store?.state?.navigation?.browserNative || false
        }
      },
      commit: storeCommitStub
    },
    $t: key => key,
    $auth: {
      $storage: {
        getUniversal: sinon.spy()
      }
    },
    $announcer: {
      setComplementRoute: () => {}
    },
    $exp: {
      $variantIndexes: [0]
    },
    $route: {
      query: {},
      fullPath: '/fr',
      path: '/fr'
    },
    $matomo: {
      trackEvent: () => {}
    },
    $i18n: {
      locale: 'fr',
      t: key => key
    },
    $cookies: {
      get: (key) => options.cookies[key] || {},
      set: () => {}
    },
    $config: { app: { baseUrl: 'https://www.example.org', siteName: 'Europeana' } },
    $nuxtI18nHead: () => nuxtI18nHead,
    ...options.mocks
  },
  stubs: {
    VueAnnouncer: { template: '<div id="announcer" aria-live="polite"></div>' },
    nuxt: true,
    PageHeader: true,
    PageFooter: true,
    NewFeatureNotification: true,
    FeedbackWidget: true
  }
});

describe('layouts/default.vue', () => {
  describe('VueAnnouncer', () => {
    it('is enabled', () => {
      const wrapper = factory();
      expect(wrapper.find('#announcer').exists()).toBe(true);
    });
  });

  describe('Klaro', () => {
    const klaroManagerStub = {
      watch: sinon.spy()
    };
    const klaroMock = {
      getManager: sinon.stub().returns(klaroManagerStub),
      render: sinon.spy()
    };

    describe('when Matomo plugin is installed', () => {
      it('waits for Matomo to be ready first', async() => {
        const $waitForMatomo = sinon.stub().resolves();

        factory({ mocks: { $waitForMatomo } });

        expect($waitForMatomo.called).toBe(true);
      });

      it('renders Klaro if Matomo becomes ready', () => {
        const $waitForMatomo = sinon.stub().resolves();

        factory({ data: { klaro: klaroMock }, mocks: { $waitForMatomo } });

        expect(klaroMock.render.called).toBe(true);
      });

      it('renders Klaro if Matomo does not become ready', () => {
        const $waitForMatomo = sinon.stub().rejects();

        factory({ data: { klaro: klaroMock }, mocks: { $waitForMatomo } });

        expect(klaroMock.render.called).toBe(true);
      });
    });

    describe('renderKlaro', () => {
      it('renders Klaro', async() => {
        const wrapper = factory();
        await wrapper.setData({ klaro: klaroMock });

        await wrapper.vm.renderKlaro();

        expect(klaroMock.render.called).toBe(true);
      });

      it('registers Klaro manager update watcher', async() => {
        const wrapper = factory();
        await wrapper.setData({ klaro: klaroMock });

        await wrapper.vm.renderKlaro();

        expect(klaroManagerStub.watch.calledWith({ update: wrapper.vm.watchKlaroManagerUpdate })).toBe(true);
      });
    });

    describe('watchKlaroManagerUpdate', () => {
      const wrapper = factory({ data: { klaro: klaroMock } });
      wrapper.vm.trackKlaroClickEvent = sinon.spy();
      const manager = null;

      describe('with event type "saveConsents"', () => {
        const eventType = 'saveConsents';

        const clickEvents = {
          accept: 'Okay/Accept all',
          decline: 'Decline',
          save: 'Accept selected'
        };
        for (const dataType in clickEvents) {
          describe(`and data type "${dataType}"`, () => {
            const data = { type: dataType };
            const eventName = clickEvents[dataType];
            it(`tracks Klaro click event with name "${eventName}"`, () => {
              wrapper.vm.watchKlaroManagerUpdate(manager, eventType, data);

              expect(wrapper.vm.trackKlaroClickEvent.calledWith(eventName)).toBe(true);
            });
          });
        }
      });
    });

    describe('trackKlaroClickEvent', () => {
      it('tracks Klaro clicks with Matomo', () => {
        const wrapper = factory({ data: { klaro: klaroMock } });
        wrapper.vm.$matomo.trackEvent = sinon.spy();

        const eventName = 'Saved';
        wrapper.vm.trackKlaroClickEvent(eventName);

        expect(wrapper.vm.$matomo.trackEvent.calledWith('Klaro', 'Clicked', eventName)).toBe(true);
      });
    });
  });

  describe('NewFeatureNotification', () => {
    describe('when no feature notification is defined', () => {
      it('is not loaded', () => {
        const wrapper = factory({ data: { featureNotification: undefined } });
        const notification = wrapper.find('[data-qa="new feature notification"]');
        expect(notification.exists()).toBe(false);
      });
    });
    describe('when feature notification is defined', () => {
      describe('and expiration has not passed', () => {
        it('is rendered', () => {
          const wrapper = factory({ data: { featureNotification: { name: 'filters' }, featureNotificationExpiration: new Date('3011-11-20') }, cookies: {} });

          const notification = wrapper.find('[data-qa="new feature notification"]');
          expect(notification.exists()).toBe(true);
        });
      });
      describe('and expiration has passed', () => {
        it('is not loaded', () => {
          const wrapper = factory({ data: { featureNotification: { name: 'filters' }, featureNotificationExpiration: new Date('2011-11-20') }, cookies: {} });

          const notification = wrapper.find('[data-qa="new feature notification"]');
          expect(notification.exists()).toBe(false);
        });
      });
      describe('and new_feature_notification cookies are set with the feature`s name', () => {
        it('is not loaded', () => {
          const wrapper = factory({ data: { featureNotification: { name: 'filters' } },
            cookies: { 'new_feature_notification': 'filters' } });

          const notification = wrapper.find('[data-qa="new feature notification"]');
          expect(notification.exists()).toBe(false);
        });
      });
      describe('and new_feature_notification cookies are set with a different name', () => {
        it('is rendered', () => {
          const wrapper = factory({ data: { featureNotification: { name: 'filters' } },
            cookies: { 'new_feature_notification': 'organisations' } });

          const notification = wrapper.find('[data-qa="new feature notification"]');
          expect(notification.exists()).toBe(true);
        });
      });
    });
  });

  describe('head', () => {
    describe('title', () => {
      it('uses site name', () => {
        const wrapper = factory();

        expect(wrapper.vm.head().title).toBe('Europeana');
      });
    });
    describe('htmlAttrs', () => {
      it('includes i18nHead html attributes', () => {
        const wrapper = factory();

        expect(wrapper.vm.head().htmlAttrs).toEqual(nuxtI18nHead.htmlAttrs);
      });
    });
    describe('link', () => {
      it('includes i18nHead head links', () => {
        const wrapper = factory();

        expect(wrapper.vm.head().link.filter(anylink => nuxtI18nHead.link.some(i18nLink => i18nLink.hid === anylink.hid))).toEqual(nuxtI18nHead.link);
      });
    });
    describe('meta', () => {
      it('includes i18nHead head meta tags', () => {
        const wrapper = factory();

        expect(wrapper.vm.head().meta.filter(anyTag => nuxtI18nHead.meta.some(i18nTag => i18nTag.hid === anyTag.hid))).toEqual(nuxtI18nHead.meta);
      });

      it('includes og:url with canonical URL', () => {
        const wrapper = factory();

        const headMeta = wrapper.vm.head().meta;

        expect(headMeta.find((tag) => tag.property === 'og:url').content).toBe('https://www.example.org/fr');
      });

      it('includes description "Europeana"', () => {
        const wrapper = factory();

        const headMeta = wrapper.vm.head().meta;

        expect(headMeta.find((tag) => tag.name === 'description').content).toBe('Europeana');
      });

      it('includes og:description "Europeana"', () => {
        const wrapper = factory();

        const headMeta = wrapper.vm.head().meta;

        expect(headMeta.find((tag) => tag.property === 'og:description').content).toBe('Europeana');
      });
    });
  });

  describe('setNativeNavigationState',() => {
    it('sets the navigation browserNative store value to true', () => {
      sinon.resetHistory();

      const wrapper = factory();

      wrapper.vm.setNativeNavigationState();

      expect(storeCommitStub.calledWith('navigation/updateBrowserNative', true)).toBe(true);
    });
  });

  describe('clearNativeNavigationState',() => {
    it('sets the navigation browserNative store value to false', () => {
      sinon.resetHistory();

      const wrapper = factory({store: { state: { navigation: { browserNative: true } } } });

      wrapper.vm.clearNativeNavigationState();
      
      expect(storeCommitStub.calledWith('navigation/updateBrowserNative', false)).toBe(true);
    });
  });
});
