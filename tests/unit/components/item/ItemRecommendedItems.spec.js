import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import ItemRecommendedItems from '@/components/item/ItemRecommendedItems.vue';

import sinon from 'sinon';
const localVue = createLocalVue();

const factory = ({ propsData = {}, mocks = {} } = {}) => shallowMountNuxt(ItemRecommendedItems, {
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

describe('components/item/ItemRecommendedItems', () => {
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
          dcCreator: ['unknown'],
          edmDataProvider: 'Europeana Foundation'
        };
        const wrapper = factory({ propsData, mocks });

        await wrapper.vm.fetch();

        expect(wrapper.vm.$apis.record.search.calledWith({
          query: '(what:("whale" OR "image")^0.8 OR who:("unknown")^0.5 OR DATA_PROVIDER:("E")^0.2) NOT europeana_id:"/123/abc"',
          rows: 4,
          profile: 'minimal',
          facet: ''
        })).toBe(true);
      });
    });
  });
});
