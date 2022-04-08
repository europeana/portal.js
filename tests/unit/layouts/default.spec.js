import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../utils';
import BootstrapVue from 'bootstrap-vue';
import Vuex from 'vuex';
import sinon from 'sinon';

import layout from '@/layouts/default';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

const store = new Vuex.Store({
  state: { breadcrumb: {} }
});

const nuxtI18nHead = { htmlAttrs: { lang: 'en-GB' },
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
  }] };

const factory = (options = {}) => shallowMountNuxt(layout, {
  localVue,
  store,
  data() {
    return options.data || {};
  },
  mocks: {
    $t: key => key,
    $auth: {
      $storage: {
        getUniversal: sinon.spy()
      }
    },
    $announcer: {
      setComplementRoute: () => {}
    },
    $features: options.features || {},
    $exp: {
      $variantIndexes: [0]
    },
    $route: {
      query: {}
    },
    $matomo: {
      trackEvent: () => {}
    },
    $i18n: {
      t: key => key
    },
    $cookies: {
      get: (key) => options.cookies[key] || {},
      set: () => {}
    },
    $config: { app: { baseUrl: 'https://www.example.eu' } },
    $nuxtI18nHead: () => nuxtI18nHead
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

    describe('renderKlaro', () => {
      it('renders Klaro', () => {
        factory({ data: { klaro: klaroMock } });

        expect(klaroMock.render.called).toBe(true);
      });

      it('registers Klaro manager update watcher', () => {
        const wrapper = factory({ data: { klaro: klaroMock } });

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

  describe('FeedbackWidget', () => {
    describe('when feedback toggle disabled', () => {
      it('is not loaded', () => {
        const wrapper = factory();
        const feedbackWidget = wrapper.find('[data-qa="feedback widget"]');
        expect(feedbackWidget.exists()).toBe(false);
      });
    });
    describe('when feedback toggle enabled', () => {
      it('is rendered', () => {
        const wrapper = factory({ features: { jiraServiceDeskFeedbackForm: true } });

        const feedbackWidget = wrapper.find('[data-qa="feedback widget"]');
        expect(feedbackWidget.exists()).toBe(true);
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

  describe('head()', () => {
    it('sets i18nHead html attributes', () => {
      const wrapper = factory();

      expect(wrapper.vm.head().htmlAttrs).toEqual(nuxtI18nHead.htmlAttrs);
    });
    it('sets i18nHead head links', () => {
      const wrapper = factory();

      expect(wrapper.vm.head().link.filter(anylink => nuxtI18nHead.link.some(i18nLink => i18nLink.hid === anylink.hid))).toEqual(nuxtI18nHead.link);
    });
    it('sets i18nHead head meta tags', () => {
      const wrapper = factory();

      expect(wrapper.vm.head().meta.filter(anyTag => nuxtI18nHead.meta.some(i18nTag => i18nTag.hid === anyTag.hid))).toEqual(nuxtI18nHead.meta);
    });
  });
});
