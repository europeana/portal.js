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
      state: {},
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
    $features: {},
    $nuxtI18nHead: () => nuxtI18nHead,
    ...options.mocks
  },
  stubs: {
    FeedbackWidget: true,
    NewFeatureNotification: true,
    NotificationBanner: true,
    nuxt: true,
    PageFooter: true,
    PageHeader: true,
    VueAnnouncer: { template: '<div id="announcer" aria-live="polite"></div>' }
  }
});

describe('layouts/default.vue', () => {
  describe('VueAnnouncer', () => {
    it('is enabled', () => {
      const wrapper = factory();
      expect(wrapper.find('#announcer').exists()).toBe(true);
    });
  });

  describe('notification banner', () => {
    describe('when no banner is configured', () => {
      it('is not rendered', () => {
        const wrapper = factory({ mocks: { $config: { app: { notificationBanner: undefined } } } });

        const banner = wrapper.find('[data-qa="notification banner"]');

        expect(banner.exists()).toBe(false);
      });
    });

    describe('when a banner is configured', () => {
      it('is rendered', () => {
        const wrapper = factory({ mocks: { $config: { app: { notificationBanner: 'hello' } } } });

        const banner = wrapper.find('[data-qa="notification banner"]');

        expect(banner.isVisible()).toBe(true);
      });
    });
  });

  describe('NewFeatureNotification', () => {
    describe('when no feature notification is active', () => {
      it('is not rendered', () => {
        const wrapper = factory({ mocks: { $config: { app: { featureNotification: undefined } } } });

        const notification = wrapper.find('[data-qa="new feature notification"]');

        expect(notification.exists()).toBe(false);
      });
    });

    describe('when a feature notification is active', () => {
      it('is rendered', () => {
        // TODO: this is brittle and requires updating whenever available notifications
        //       changes; mock it
        const wrapper = factory({ mocks: { $config: { app: { featureNotification: { name: 'featureIdeas' } } } } });

        const notification = wrapper.find('[data-qa="new feature notification"]');

        expect(notification.isVisible()).toBe(true);
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
