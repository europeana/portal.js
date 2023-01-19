import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import sinon from 'sinon';

import EntityCardGroup from '@/components/entity/EntityCardGroup.vue';

const localVue = createLocalVue();

const entityUris = ['http://data.europeana.eu/concept/123', 'http://data.europeana.eu/agent/123'];

const factory = ({ propsData } = {}) => {
  return shallowMountNuxt(EntityCardGroup, {
    localVue,
    propsData: {
      title: 'title value',
      ...propsData
    },
    stubs: ['b-card-group']
  });
};

describe('components/related/EntityBadges', () => {
  describe('fetch', () => {
    describe('when entity URIs are supplied', () => {
      const propsData = { entityUris };

      it('fetches entities with editorial overrides', async() => {
        const wrapper = factory({ propsData });

        wrapper.vm.fetchEntitiesWithEditorialOverrides = sinon.spy();

        await wrapper.vm.fetch();

        expect(wrapper.vm.fetchEntitiesWithEditorialOverrides.calledWith(entityUris)).toBe(true);
      });
    });

    describe('and no entity URIs are supplied', () => {
      it('has no collections', async() => {
        const wrapper = factory();

        await wrapper.vm.fetch();

        expect(wrapper.vm.collections).toEqual([]);
      });
    });
  });
});
