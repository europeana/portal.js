import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import ItemRecommendations from '@/components/item/ItemRecommendations.vue';

import sinon from 'sinon';
const localVue = createLocalVue();

const factory = ({ propsData = {}, mocks = {} } = {}) => shallowMountNuxt(ItemRecommendations, {
  localVue,
  propsData,
  mocks: {
    $apis: {
      recommendation: {
        recommend: sinon.stub().resolves({ items: [] })
      },
      record: {
        search: sinon.stub().resolves({ items: [] })
      }
    },
    $auth: {},
    $fetchState: {},
    $i18n: { locale: 'en' },
    ...mocks
  }
});

describe('components/item/ItemRecommendations', () => {
  describe('fetch', () => {
    describe('when user is logged in', () => {
      const mocks = { $auth: { loggedIn: true } };
      it('queries the Recommendation API by the item ID', async() => {
        const propsData = { identifier: '/123/abc' };
        const wrapper = factory({ propsData, mocks });

        await wrapper.vm.fetch();

        expect(wrapper.vm.$apis.recommendation.recommend.calledWith('record', propsData.identifier)).toBe(true);
      });
    });

    describe('when user is not logged in', () => {
      const mocks = { $auth: { loggedIn: false } };
      it('queries the Record API by the metadata', async() => {
        const propsData = {
          identifier: '/123/abc',
          dcSubject: { en: ['whale'] },
          dcType: { def: ['image'] },
          dcCreator: null,
          edmDataProvider: { def: ['Europeana Foundation'] }
        };
        const wrapper = factory({ propsData, mocks });

        await wrapper.vm.fetch();

        expect(wrapper.vm.$apis.record.search.calledWith({
          query: '(what:("whale" OR "image")^0.8 OR DATA_PROVIDER:("Europeana Foundation")^0.2) NOT europeana_id:"/123/abc"',
          rows: 4,
          profile: 'minimal',
          facet: ''
        })).toBe(true);
      });
    });
  });
});
