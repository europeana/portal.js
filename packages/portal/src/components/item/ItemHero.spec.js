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
    $auth: {
      loggedIn: true,
      userHasClientRole: sinon.stub().returns(false)
    },
    $store: {
      getters: {
        'entity/isPinned': storeIsPinnedGetter,
        'entity/id': 'id123'
      },
      dispatch: storeDispatch
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
    edmRights: {
      def: ['http://creativecommons.org/licenses/by-sa/3.0/']
    }
  }),
  new WebResource({
    about: 'https://europeana1914-1918.s3.amazonaws.com/attachments/119200/10265.119200.original.jpg',
    edmRights: {
      def: ['http://rightsstatements.org/vocab/InC/1.0/']
    }
  }),
  new WebResource({
    about: 'https://europeana1914-1918.s3.amazonaws.com/attachments/119203/10265.119203.original.jpg',
    edmRights: {
      def: ['Atribution-NonCommercial-NoDerivatives 4.0 Internacional']
    }
  }),
  new WebResource({
    about: 'https://europeana1914-1918.s3.amazonaws.com/attachments/119639/10265.119639.original.jpg',
    edmRights: {
      def: ['http://creativecommons.org/licenses/by-sa/3.0/']
    }
  }),
  new WebResource({
    about: 'https://europeana1914-1918.s3.amazonaws.com/attachments/119640/10265.119640.original.jpg',
    edmRights: {
      def: ['http://creativecommons.org/licenses/by-sa/3.0/']
    }
  }),
  new WebResource({
    about: 'https://europeana1914-1918.s3.amazonaws.com/',
    forEdmIsShownAt: true,
    edmRights: {
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
        expect(wrapper.vm.selectedMedia.edmRights.def[0]).toBe(media[1].edmRights.def[0]);
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
        const wrapper = factory({ propsData: { media, entities }, mocks });

        const showPins = wrapper.vm.showPins;

        expect(showPins).toBe(true);
      });

      it('is `false` if no entities', () => {
        const wrapper = factory({ propsData: { media, entities: [] }, mocks });

        const showPins = wrapper.vm.showPins;

        expect(showPins).toBe(false);
      });
    });

    describe('when the user is NOT an editor', () => {
      it('is `false`', () => {
        const wrapper = factory({ propsData: { media, entities } });

        const showPins = wrapper.vm.showPins;

        expect(showPins).toBe(false);
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
