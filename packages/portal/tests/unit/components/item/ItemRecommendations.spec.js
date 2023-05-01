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
      }
    },
    $fetchState: {},
    $i18n: { locale: 'en' },
    $t: key => key,
    ...mocks
  },
  stubs: ['b-row', 'b-col']
});

describe('components/item/ItemRecommendations', () => {
  describe('fetch', () => {
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
});
