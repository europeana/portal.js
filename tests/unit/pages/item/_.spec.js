import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import page from '../../../../pages/item/_';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMountNuxt(page, {
  localVue,
  data() {
    return {
      identifier: '/123/abc'
    };
  },
  mocks: {
    $config: { app: { features: {} } },
    $pageHeadTitle: key => key,
    $t: key => key,
    $auth: {
      loggedIn: false
    },
    $store: {
      getters: {
        'apis/annotation': {
          search: sinon.spy()
        },
        'apis/entity': {
          findEntities: sinon.spy()
        },
        'api/record': {
          getRecord: sinon.stub().resolves({}),
          search: sinon.spy()
        },
        'set/isLiked': sinon.stub()
      }
    }
  }
});

describe('pages/item/_.vue', () => {
  describe('asyncData()', () => {
    it('gets a record from the API for the ID in the params pathMatch, for the current locale', async() => {
      const params = { pathMatch: '123/abc' };
      const record = { id: '/123/abc' };
      const store = { getters: { 'apis/record': { getRecord: sinon.stub().resolves({ record }) } } };
      const app = { i18n: { locale: 'en' } };

      const wrapper = factory();

      const response = await wrapper.vm.asyncData({ params, store, app });

      store.getters['apis/record'].getRecord.should.have.been.calledWith('/123/abc', { locale: 'en' });
      response.should.eql(record);
    });
  });

  describe('head()', () => {
    it('uses first media large thumbnail for og:image', () => {
      const thumbnailUrl = 'http://example.org/image/large.jpg';
      const wrapper = factory();
      wrapper.setData({
        media: [
          {
            thumbnails: {
              large: thumbnailUrl
            }
          }
        ]
      });

      const headMeta = wrapper.vm.head().meta;

      headMeta.find(meta => meta.property === 'og:image').content.should.eq(thumbnailUrl);
    });
  });
});
