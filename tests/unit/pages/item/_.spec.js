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
    $config: { app: { features: {} } },
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
        findEntities: sinon.spy()
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

    context('when the page is loaded without a metadataLanguage', () => {
      const route = { query: {} };

      it('gets a record from the API for the ID in the params pathMatch, for the current locale', async() => {
        const wrapper = factory();

        const response = await wrapper.vm.asyncData({ params, app, route, $apis });

        $apis.record.getRecord.should.have.been.calledWith('/123/abc', { locale: 'en', metadataLanguage: undefined });
        response.should.eql(record);
      });
    });
    context('when the page is loaded with a metadataLanguage', () => {
      const route = { query: { lang: 'fr' } };

      it('gets a record from the API for the ID in the params pathMatch, with metadataLanguage from `lang` query', async() => {
        const wrapper = factory();

        const response = await wrapper.vm.asyncData({ params, app, route, $apis });

        $apis.record.getRecord.should.have.been.calledWith('/123/abc', { locale: 'en', metadataLanguage: 'fr' });
        response.should.eql(record);
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

      headMeta.filter(meta => meta.property === 'og:image').length.should.eq(1);
      headMeta.find(meta => meta.property === 'og:image').content.should.eq(thumbnailUrl);
    });
  });
});
