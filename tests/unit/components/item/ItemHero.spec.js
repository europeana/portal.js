import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import ItemHero from '../../../../src/components/item/ItemHero.vue';
import sinon from 'sinon';
const localVue = createLocalVue();
localVue.use(BootstrapVue);
const storeDispatch = sinon.spy();
const storeIsLikedGetter = sinon.stub();

const factory = (propsData) => mount(ItemHero, {
  localVue,
  propsData,
  mocks: {
    $t: (key) => key,
    $config: {
      app: { features: { itemEmbedCode: false } }
    },
    $auth: { loggedIn: false },
    $store: {
      state: {
        set: { ...{ liked: [] }, ...{} }
      },
      getters: {
        'set/isLiked': storeIsLikedGetter
      },
      dispatch: storeDispatch
    },
    $apis: {
      record: {
        mediaProxyUrl: (val) => `proxied - ${val}`
      }
    }
  }
});

const media = [
  {
    about: 'https://europeana1914-1918.s3.amazonaws.com/attachments/119112/10265.119112.original.jpg',
    thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119112%2F10265.119112.original.jpg' },
    webResourceEdmRights: {
      def: ['http://creativecommons.org/licenses/by-sa/3.0/']
    }
  },
  {
    about: 'https://europeana1914-1918.s3.amazonaws.com/attachments/119200/10265.119200.original.jpg',
    thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119200%2F10265.119200.original.jpg' },
    webResourceEdmRights: {
      def: ['http://rightsstatements.org/vocab/InC/1.0/']
    }
  },
  {
    about: 'https://europeana1914-1918.s3.amazonaws.com/attachments/119203/10265.119203.original.jpg',
    thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119203%2F10265.119203.original.jpg' },
    webResourceEdmRights: {
      def: ['Atribution-NonCommercial-NoDerivatives 4.0 Internacional']
    }
  },
  {
    about: 'https://europeana1914-1918.s3.amazonaws.com/attachments/119639/10265.119639.original.jpg',
    thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119639%2F10265.119639.original.jpg' },
    webResourceEdmRights: {
      def: ['http://creativecommons.org/licenses/by-sa/3.0/']
    }
  },
  {
    about: 'https://europeana1914-1918.s3.amazonaws.com/attachments/119640/10265.119640.original.jpg',
    thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119640%2F10265.119640.original.jpg' },
    webResourceEdmRights: {
      def: ['http://creativecommons.org/licenses/by-sa/3.0/']
    }
  },
  {
    about: 'https://europeana1914-1918.s3.amazonaws.com/',
    isShownAt: true,
    thumbnails: { large: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Feuropeana1914-1918.s3.amazonaws.com%2Fattachments%2F119640%2F10265.119640.original.jpg' },
    webResourceEdmRights: {
      def: ['http://creativecommons.org/licenses/by-sa/3.0/']
    }
  }
];
const identifier = '/2020601/https___1914_1918_europeana_eu_contributions_10265';

describe('components/item/ItemHero', () => {
  describe('selectMedia', () => {
    context('when a new item is selected', () => {
      it('updates the identifier', () => {
        const wrapper = factory({ media, identifier });
        wrapper.vm.selectMedia(media[1].about);
        wrapper.vm.selectedMedia.about.should.eq(media[1].about);
      });
      it('updates the rights statement', () => {
        const wrapper = factory({ media, identifier });
        wrapper.vm.selectMedia(media[1].about);
        wrapper.vm.selectedMedia.webResourceEdmRights.def[0].should.eq(media[1].webResourceEdmRights.def[0]);
      });
      it('unsets any selected IIIF canvas', () => {
        const wrapper = factory({ media, identifier });
        wrapper.setData({ selectedCanvas: { about: 'http://www.example.org/canvas' } });
        wrapper.vm.selectMedia(media[1].about);
        (wrapper.vm.selectedCanvas === null).should.eq(true);
      });
    });
  });

  describe('downloadEnabled', () => {
    context('when the rightsstatement is in copyright', () => {
      it('is false', () => {
        const wrapper = factory({ media: [media[1]], identifier });
        wrapper.vm.downloadEnabled.should.eq(false);
      });
    });
    context('when the selected media is the isShownAt and not downloadable', () => {
      it('is false', () => {
        const wrapper = factory({ media: [media[5]], identifier });
        wrapper.vm.downloadEnabled.should.eq(false);
      });
    });
    context('when the rightsstatement is not in copyright and the selected media is not the isShownAt', () => {
      it('is true', () => {
        const wrapper = factory({ media: [media[0]], identifier });
        wrapper.vm.downloadEnabled.should.eq(true);
      });
    });
  });

  describe('downloadUrl', () => {
    // allMediaUris set to existing media plus one iiif canvas
    const propsData = { allMediaUris: media.map((media) => media.about).concat('http://www.example.org/canvas'), media, identifier };
    context('when the webresource is the isShownBy', () => {
      it('uses the proxy', () => {
        const wrapper = factory(propsData);
        wrapper.setData({ selectedMedia: media[0] });
        wrapper.vm.downloadUrl.should.eq('proxied - https://europeana1914-1918.s3.amazonaws.com/attachments/119112/10265.119112.original.jpg');
      });
    });
    context('when the webresource is a newspaper IIIF canvas', () => {
      it('uses the proxy', () => {
        const wrapper = factory(propsData);
        wrapper.setData({ selectedMedia: media[0] });
        wrapper.setData({ selectedCanvas: { about: 'http://www.example.org/canvas' } });
        wrapper.vm.downloadUrl.should.eq('proxied - http://www.example.org/canvas');
      });
    });
    context('when the webresource is an unknown IIIF canvas', () => {
      it('does not use the proxy', () => {
        const wrapper = factory(propsData);
        wrapper.setData({ selectedMedia: media[0] });
        wrapper.setData({ selectedCanvas: { about: 'http://www.example.org/another-canvas' } });
        wrapper.vm.downloadUrl.should.eq('http://www.example.org/another-canvas');
      });
    });
  });

  describe('downloadViaProxy', () => {
    const propsData = { allMediaUris: ['http://www.example.org/canvas'], media: [media[0]], identifier };
    context('when the url is in the list of allMediaUris', () => {
      it('returns true', () => {
        const wrapper = factory(propsData);
        wrapper.vm.downloadViaProxy('http://www.example.org/canvas').should.eq(true);
      });
    });
    context('when the url is NOT in the list of allMediaUris', () => {
      it('returns false', () => {
        const wrapper = factory(propsData);
        wrapper.vm.downloadViaProxy('http://www.example.org/another-resource').should.eq(false);
      });
    });
  });
});
