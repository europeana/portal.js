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

const factory = (options = {}) => shallowMountNuxt(layout, {
  localVue,
  data() {
    return options.data || {};
  },
  mocks: {
    $store: {
      state: {
        breadcrumb: {}
      },
      getters: {
        'debug/settings': {}
      }
    },
    $t: (key) => key,
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
});
