import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import DefaultLayout from '../../../layouts/default.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const $store = {
  state: {
    breadcrumb: {
      data: null
    }
  }
};

const factory = () => shallowMount(DefaultLayout, {
  localVue,
  mocks: {
    $t: () => {},
    $i18n: {
      defaultLocale: 'en',
      isoLocale: () => 'en-GB'
    },
    $store
  }
});

describe('layouts/DefaultLayout', () => {
  describe('i18nLinksWithDefault()', () => {
    it('returns the correct default `hreflang` ', () => {
      const wrapper = factory();
      const mockedI18nSeo = {
        link: [
          {
            hid: 'alternate-hreflang-bg-BG',
            rel: 'alternate',
            href: 'https://www.europeana.eu/bg',
            hreflang: 'bg-BG'
          },
          {
            hid: 'alternate-hreflang-cs-CZ',
            rel: 'alternate',
            href: 'https://www.europeana.eu/cs',
            hreflang: 'cs-CZ'
          },
          {
            hid: 'alternate-hreflang-en-GB',
            rel: 'alternate',
            href: 'https://www.europeana.eu/en',
            hreflang: 'en-GB'
          }
        ]
      };
      const method = wrapper.vm.i18nLinksWithDefault(mockedI18nSeo);

      method.should.eql([
        {
          hreflang: 'x-default',
          rel: 'alternate',
          href: 'https://www.europeana.eu/en'
        },
        ...mockedI18nSeo.link
      ]);
    });
  });
});
