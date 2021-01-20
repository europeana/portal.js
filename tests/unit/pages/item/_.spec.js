import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import page from '../../../../pages/item/_';

const optionsVar = {
  itemCountry: undefined,
  itemDataProvider: 'Data Provider',
  itemProvider: undefined,
  itemRights: undefined
};

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMountNuxt(page, {
  localVue,
  data() {
    return {
      identifier: '/123/abc',
      coreFields: {
        edmDataProvider: {
          url: 'https://www.example.eu',
          value: ['Data Provider']
        }
      }
    };
  },
  mocks: {
    $config: { app: { features: {} } },
    $pageHeadTitle: key => key,
    $t: key => key,
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
      getters: {
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
      const $apis = { record: { getRecord: sinon.stub().resolves({ record }) } };
      const app = { i18n: { locale: 'en' } };

      const wrapper = factory();

      const response = await wrapper.vm.asyncData({ params, app, $apis });

      $apis.record.getRecord.should.have.been.calledWith('/123/abc', { locale: 'en' });
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

  describe('gtmOptions()', () => {
    it('uses first edmDataProvider from corefields', () => {
      const wrapper = factory();
      wrapper.vm.gtmOptions().should.eql(optionsVar);
    });
  });
});
