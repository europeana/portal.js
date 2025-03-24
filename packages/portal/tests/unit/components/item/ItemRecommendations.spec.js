import { createLocalVue } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import { shallowMountNuxt } from '../../utils';
import ItemRecommendations from '@/components/item/ItemRecommendations.vue';

import sinon from 'sinon';
const localVue = createLocalVue();
localVue.use(BootstrapVue);

const recommendedItems = [
  { id: '/123/abc' },
  { id: '/123/bcd' },
  { id: '/123/cde' },
  { id: '/123/def' },
  { id: '/123/efg' },
  { id: '/123/fgh' },
  { id: '/123/ghi' },
  { id: '/123/hij' },
  { id: '/123/ijk' },
  { id: '/123/jkl' }
];

const factory = ({ propsData = {}, mocks = {} } = {}) => shallowMountNuxt(ItemRecommendations, {
  localVue,
  propsData,
  mocks: {
    $apis: {
      recommendation: {
        recommend: sinon.stub().resolves({ items: recommendedItems })
      },
      record: {
        search: sinon.stub().resolves({ items: recommendedItems })
      }
    },
    $auth: {},
    $i18n: { locale: 'en' },
    $t: (key) => key,
    ...mocks
  },
  stubs: ['b-row', 'b-col']
});

describe('components/item/ItemRecommendations', () => {
  describe('fetch', () => {
    describe('when user is logged in', () => {
      const mocks = { $auth: { loggedIn: true } };
      const propsData = { identifier: '/123/abc' };

      it('queries the Recommendation API by the item ID', async() => {
        const wrapper = factory({ propsData, mocks });

        await wrapper.vm.fetch();

        expect(wrapper.vm.$apis.recommendation.recommend.calledWith('record', propsData.identifier)).toBe(true);
      });

      it('stores the items, removing self-recommendation, limiting to 8', async() => {
        const wrapper = factory({ propsData, mocks });

        await wrapper.vm.fetch();

        expect(wrapper.vm.items.length).toBe(8);
        expect(wrapper.vm.items.some((item) => item.id === propsData.identifier)).toBe(false);
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
          qf: ['contentTier:(1 OR 2 OR 3 OR 4)'],
          rows: 4,
          profile: 'minimal',
          facet: ''
        })).toBe(true);
      });
    });
  });

  describe('when a similar item is clicked', () => {
    it('logs the clicked item rank to APM', async() => {
      const identifier = '/123/abc';
      const propsData = { identifier };
      const wrapper = factory({ propsData });
      sinon.spy(wrapper.vm, 'logApmTransaction');

      await wrapper.vm.$fetch();
      await wrapper.vm.onClickItem(recommendedItems[0].id);

      expect(wrapper.vm.logApmTransaction.calledWith({
        name: 'Similar items - click item',
        labels: { 'logged_in_user': false,
          'similar_items_algorithm': wrapper.vm.similarItemsAlgorithm,
          'similar_items_clicked_item': recommendedItems[0].id,
          'similar_items_count': 10,
          'similar_items_current_item': identifier,
          'similar_item_rank': 1 }
      })).toBe(true);
    });
  });
});
