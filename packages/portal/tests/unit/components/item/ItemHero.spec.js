import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import WebResource from '@/plugins/europeana/edm/WebResource.js';
import ItemHero from '@/components/item/ItemHero.vue';
import sinon from 'sinon';
const localVue = createLocalVue();
localVue.use(BootstrapVue);

const storeDispatch = sinon.spy();
const storeIsLikedGetter = sinon.stub();
const storeIsPinnedGetter = sinon.stub();

const factory = ({ propsData = {}, mocks = {} } = {}) => shallowMount(ItemHero, {
  localVue,
  propsData,
  mocks: {
    $t: (key) => key,
    $i18n: { locale: 'en' },
    $features: { itemEmbedCode: false, transcribathonCta: true },
    $auth: {
      loggedIn: true,
      userHasClientRole: sinon.stub().returns(false)
    },
    $store: {
      state: {
        set: { ...{ liked: [] }, ...{} }
      },
      getters: {
        'set/isLiked': storeIsLikedGetter,
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
  stubs: ['ItemMediaPresentation']
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
const identifier = '/2020601/https___1914_1918_europeana_eu_contributions_10265';
const entities = [{ about: 'http://data.europeana.eu/agent/123', prefLabel: { 'en': ['CARARE'] } }];

describe('components/item/ItemHero', () => {
  describe('selectMedia', () => {
    describe('when a new item is selected', () => {
      it('updates the identifier', () => {
        const wrapper = factory({ propsData: { media, identifier } });
        wrapper.vm.selectMedia(media[1]);
        expect(wrapper.vm.selectedMedia.about).toBe(media[1].about);
      });

      it('updates the rights statement', () => {
        const wrapper = factory({ propsData: { media, identifier } });
        wrapper.vm.selectMedia(media[1]);
        expect(wrapper.vm.selectedMedia.webResourceEdmRights.def[0]).toBe(media[1].webResourceEdmRights.def[0]);
      });
    });
  });

  describe('downloadEnabled', () => {
    describe('when the rightsstatement is in copyright', () => {
      it('is false', () => {
        const wrapper = factory({ propsData: { media: [media[1]], identifier } });
        expect(wrapper.vm.downloadEnabled).toBe(false);
      });
    });
    describe('when the selected media is the isShownAt, hence not downloadable', () => {
      it('is false', () => {
        const wrapper = factory({ propsData: { media: [media[5]], identifier } });
        expect(wrapper.vm.downloadEnabled).toBe(false);
      });
    });
    describe('when the rightsstatement is not in copyright and the selected media is not the isShownAt', () => {
      it('is true', () => {
        const wrapper = factory({ propsData: { media: [media[0]], identifier } });
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
    const propsData = { allMediaUris: ['http://www.example.org/canvas'], media: [media[0]], identifier };
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

  describe('showTranscribathonLink', () => {
    describe('when the linkForContributingAnnotation goes to a transcribathon URL', () => {
      it('is true', async() => {
        const wrapper = factory({ propsData: { linkForContributingAnnotation: 'https://europeana.transcribathon.eu/documents/story/?story=123', media, identifier, entities } });

        expect(wrapper.vm.showTranscribathonLink).toBe(true);
      });
    });

    describe('when the linkForContributingAnnotation goes to a NON transcribathon URL', () => {
      it('is true', async() => {
        const wrapper = factory({ propsData: { linkForContributingAnnotation: 'https://example.org/123', media, identifier, entities } });

        expect(wrapper.vm.showTranscribathonLink).toBe(false);
      });
    });
  });

  describe('showPins', () => {
    describe('when the user is an editor', () => {
      const userHasClientRole = sinon.stub().returns(false)
        .withArgs('entities', 'editor').returns(true)
        .withArgs('usersets', 'editor').returns(true);
      const mocks = {
        $auth: {
          loggedIn: true,
          userHasClientRole
        }
      };

      it('is `true`', () => {
        const wrapper = factory({ propsData: { media, identifier, entities }, mocks });

        const showPins = wrapper.vm.showPins;

        expect(showPins).toBe(true);
      });

      it('is `false` if no entities', () => {
        const wrapper = factory({ propsData: { media, identifier, entities: [] }, mocks });

        const showPins = wrapper.vm.showPins;

        expect(showPins).toBe(false);
      });
    });

    describe('when the user is NOT an editor', () => {
      it('is `false`', () => {
        const wrapper = factory({ propsData: { media, identifier, entities } });

        const showPins = wrapper.vm.showPins;

        expect(showPins).toBe(false);
      });
    });
  });
});
