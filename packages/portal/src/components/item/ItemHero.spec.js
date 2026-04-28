import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import WebResource from '@/plugins/europeana/edm/WebResource.js';
import ItemHero from '@/components/item/ItemHero.vue';
import sinon from 'sinon';
import nock from 'nock';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const storeDispatch = sinon.spy();
const storeIsPinnedGetter = sinon.stub();

const factory = ({ propsData = {}, mocks = {}, provide = {} } = {}) => shallowMount(ItemHero, {
  localVue,
  propsData: {
    identifier: '/001/abc',
    ...propsData
  },
  provide: {
    itemIsDeleted: false,
    ...provide
  },
  mocks: {
    $t: (key) => key,
    $i18n: { locale: 'en' },
    $features: { itemEmbedCode: false, transcribathonCta: true },
    $store: {
      getters: {
        'entity/isPinned': storeIsPinnedGetter,
        'entity/id': 'id123'
      },
      dispatch: storeDispatch
    },
    $apis: {
      record: {
        mediaProxyUrl: (val) => `proxied - ${val}`
      }
    },
    $config: {
      europeana: {
        proxy: {
          media: {
            url: 'https://proxy.europeana.eu'
          }
        }
      }
    },
    $nuxt: {
      context: {}
    },
    ...mocks
  },
  stubs: ['ItemMediaPresentation', 'NotificationBanner', 'UserButtons']
});

const media = [
  new WebResource({
    about: 'https://europeana1914-1918.s3.amazonaws.com/attachments/119112/10265.119112.original.jpg',
    webResourceEdmRights: {
      def: ['http://creativecommons.org/licenses/by-sa/3.0/']
    }
  }),
  new WebResource({
    about: 'https://europeana1914-1918.s3.amazonaws.com/attachments/119200/10265.119200.original.jpg',
    webResourceEdmRights: {
      def: ['http://rightsstatements.org/vocab/InC/1.0/']
    }
  }),
  new WebResource({
    about: 'https://europeana1914-1918.s3.amazonaws.com/attachments/119203/10265.119203.original.jpg',
    webResourceEdmRights: {
      def: ['Atribution-NonCommercial-NoDerivatives 4.0 Internacional']
    }
  }),
  new WebResource({
    about: 'https://europeana1914-1918.s3.amazonaws.com/attachments/119639/10265.119639.original.jpg',
    webResourceEdmRights: {
      def: ['http://creativecommons.org/licenses/by-sa/3.0/']
    }
  }),
  new WebResource({
    about: 'https://europeana1914-1918.s3.amazonaws.com/attachments/119640/10265.119640.original.jpg',
    webResourceEdmRights: {
      def: ['http://creativecommons.org/licenses/by-sa/3.0/']
    }
  }),
  new WebResource({
    about: 'https://europeana1914-1918.s3.amazonaws.com/',
    forEdmIsShownAt: true,
    webResourceEdmRights: {
      def: ['http://creativecommons.org/licenses/by-sa/3.0/']
    }
  })
];

const entities = [{ about: 'http://data.europeana.eu/agent/123', prefLabel: { 'en': ['CARARE'] } }];

describe('components/item/ItemHero', () => {
  describe('selectMedia', () => {
    describe('when a new item is selected', () => {
      it('updates the identifier', () => {
        const wrapper = factory({ propsData: { media } });
        wrapper.vm.selectMedia(media[1]);
        expect(wrapper.vm.selectedMedia.about).toBe(media[1].about);
      });

      it('updates the rights statement', () => {
        const wrapper = factory({ propsData: { media } });
        wrapper.vm.selectMedia(media[1]);
        expect(wrapper.vm.selectedMedia.webResourceEdmRights.def[0]).toBe(media[1].webResourceEdmRights.def[0]);
      });
    });
  });

  describe('downloadEnabled', () => {
    describe('when the rightsstatement is in copyright', () => {
      it('is false', () => {
        const wrapper = factory({ propsData: { media: [media[1]] } });
        expect(wrapper.vm.downloadEnabled).toBe(false);
      });
    });
    describe('when the selected media is the isShownAt, hence not downloadable', () => {
      it('is false', () => {
        const wrapper = factory({ propsData: { media: [media[5]] } });
        expect(wrapper.vm.downloadEnabled).toBe(false);
      });
    });
    describe('when the rightsstatement is not in copyright and the selected media is not the isShownAt', () => {
      it('is true', () => {
        const wrapper = factory({ propsData: { media: [media[0]] } });
        expect(wrapper.vm.downloadEnabled).toBe(true);
      });
    });
  });

  describe('downloadUrl', () => {
    const propsData = { allMediaUris: media.map((media) => media.about) };

    describe('when the webresource is the isShownBy', () => {
      it('uses the proxy', async() => {
        const wrapper = factory({ propsData });

        await wrapper.setData({ selectedMedia: media[0] });

        expect(wrapper.vm.downloadUrl).toBe('proxied - https://europeana1914-1918.s3.amazonaws.com/attachments/119112/10265.119112.original.jpg');
      });
    });

    describe('when the webresource is an unknown image, e.g. from IIIF', () => {
      it('does not use the proxy', async() => {
        const wrapper = factory({ propsData });

        await wrapper.setData({ selectedMedia: { about: 'http://www.example.org/other.jpeg' } });

        expect(wrapper.vm.downloadUrl).toBe('http://www.example.org/other.jpeg');
      });
    });
  });

  describe('downloadViaProxy', () => {
    const propsData = { allMediaUris: ['http://www.example.org/canvas'], media: [media[0]] };
    describe('when the url is in the list of allMediaUris', () => {
      it('returns true', () => {
        const wrapper = factory({ propsData });
        expect(wrapper.vm.downloadViaProxy('http://www.example.org/canvas')).toBe(true);
      });
    });
    describe('when the url is NOT in the list of allMediaUris', () => {
      it('returns false', () => {
        const wrapper = factory({ propsData });
        expect(wrapper.vm.downloadViaProxy('http://www.example.org/another-resource')).toBe(false);
      });
    });
  });

  describe('fetchEmbedCode', () => {
    const OEMBED_BASE_URL = 'https://oembed.europeana.eu';
    const identifier = '/123/abc';
    const html = '<iframe src=""></iframe>';
    beforeEach(() => {
      nock(OEMBED_BASE_URL)
        .get('/')
        .query(query => {
          return query.url === 'http://data.europeana.eu/item/123/abc' && query.format === 'json';
        })
        .reply(200, { html });
    });

    afterEach(() => {
      nock.cleanAll();
    });

    it('sends an oEmbed request to the Europeana oEmbed provider', async() => {
      const wrapper = factory({ propsData: { identifier }  });

      await wrapper.vm.fetchEmbedCode();

      expect(nock.isDone()).toBe(true);
    });

    it('stores html from response body on component embedCode property', async() => {
      const wrapper = factory({ propsData: { identifier } });

      await wrapper.vm.fetchEmbedCode();

      expect(wrapper.vm.embedCode).toBe(html);
    });
  });

  describe('when item is depublished', () => {
    it('shows a notification banner', () => {
      const wrapper = factory({ provide: { itemIsDeleted: true } });

      expect(wrapper.find('notificationbanner-stub').isVisible()).toBe(true);
    });
  });
});
