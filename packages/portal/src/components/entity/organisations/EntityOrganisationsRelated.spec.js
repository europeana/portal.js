import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';
import EntityOrganisationsRelated from './EntityOrganisationsRelated.vue';
import sinon from 'sinon';

const localVue = createLocalVue();

const entityId = '001';

const factory = (propsData) => {
  return shallowMountNuxt(EntityOrganisationsRelated, {
    localVue,
    propsData,
    mocks: {
      $t: (val) => val
    },
    stubs: ['EntityBadges']
  });
};

describe('components/entity/organisations/EntityOrganisationsRelated', () => {
  describe('fetch', () => {
    it('fetches full entity by id and sets aggregatesFrom', async() => {
      const aggregatesFrom = ['002'];
      const wrapper = factory({ entityId });

      wrapper.vm.$apis = { entity: { find: sinon.stub().resolves([{ aggregatesFrom }]) } };

      await wrapper.vm.fetch();

      expect(wrapper.vm.$apis.entity.find.calledWith([entityId])).toBe(true);
      expect(wrapper.vm.aggregatesFrom).toBe(aggregatesFrom);
    });
  });

  describe('methods', () => {
    describe('relatedEntitiesFetched', () => {
      it('sets aggregatesFromEntities to the passed in organisations', async() => {
        const orgs = ['003'];
        const wrapper = factory({ entityId });
        wrapper.vm.relatedEntitiesFetched(orgs);

        expect(wrapper.vm.aggregatesFromEntities).toEqual(orgs);
      });
    });
  });
});
