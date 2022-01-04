import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import page from '@/pages/item/_';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const item = {
  identifier: '/123/abc',
  coreFields: {
    edmDataProvider: {
      url: 'https://www.example.eu',
      value: ['Data Provider']
    }
  }
};

const storeDispatch = sinon.spy();

const factory = () => shallowMountNuxt(page, {
  localVue,
  data() {
    return item;
  },
  stubs: ['client-only'],
  mocks: {
    $features: {},
    $pageHeadTitle: key => key,
    $route: {
      query: {}
    },
    $t: key => key,
    $i18n: {
      locale: 'en'
    },
    $auth: {
      loggedIn: false
    },
    $apis: {
      annotation: {
        search: sinon.spy()
      },
      entity: {
        find: sinon.spy()
      },
      record: {
        getRecord: sinon.stub().resolves({}),
        search: sinon.spy()
      }
    },
    $store: {
      state: {
        item: {
          active: false,
          annotations: [],
          relatedEntities: [],
          similarItems: []
        }
      },
      getters: {
        'set/isLiked': sinon.stub(),
        'item/annotationsByMotivation': sinon.stub()
      },
      dispatch: storeDispatch
    }
  }
});

describe('pages/item/_.vue', () => {
  describe('asyncData()', () => {
    const params = { pathMatch: '123/abc' };
    const record = { id: '/123/abc' };
    const $apis = { record: { getRecord: sinon.stub().resolves({ record }) } };
    const app = { i18n: { locale: 'en' } };

    describe('when the page is loaded without a metadataLanguage', () => {
      const route = { query: {} };

      it('gets a record from the API for the ID in the params pathMatch, for the current locale', async() => {
        const wrapper = factory();

        const response = await wrapper.vm.asyncData({ params, app, route, $apis });

        expect($apis.record.getRecord.calledWith('/123/abc', { locale: 'en', metadataLanguage: undefined }));
        expect(response).toEqual(record);
      });
    });
    describe('when the page is loaded with a metadataLanguage', () => {
      const route = { query: { lang: 'fr' } };

      it('gets a record from the API for the ID in the params pathMatch, with metadataLanguage from `lang` query', async() => {
        const wrapper = factory();

        const response = await wrapper.vm.asyncData({ params, app, route, $apis });

        expect($apis.record.getRecord.calledWith('/123/abc', { locale: 'en', metadataLanguage: 'fr' }));
        expect(response).toEqual(record);
      });
    });
  });

  describe('head()', () => {
    it('uses first media large thumbnail for og:image', async() => {
      const thumbnailUrl = 'http://example.org/image/large.jpg';
      const wrapper = factory();
      await wrapper.setData({
        media: [
          {
            thumbnails: {
              large: thumbnailUrl
            }
          }
        ]
      });

      const headMeta = wrapper.vm.head().meta;

      expect(headMeta.filter(meta => meta.property === 'og:image').length).toBe(1);
      expect(headMeta.find(meta => meta.property === 'og:image').content).toBe(thumbnailUrl);
    });
  });
});
