import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';
import sinon from 'sinon';
import nock from 'nock';

import EntityOrganisationsRelated from './EntityOrganisationsRelated.vue';
import * as backendFetchModule from '@/utils/backendFetch.js';

const localVue = createLocalVue();

const entityId = '001';

const factory = (propsData) => {
  return shallowMountNuxt(EntityOrganisationsRelated, {
    localVue,
    propsData,
    mocks: {
      $nuxt: { context: {} },
      $t: (val) => val
    },
    stubs: ['EntityBadges', 'client-only']
  });
};

describe('components/entity/organisations/EntityOrganisationsRelated', () => {
  const backendFetch = sinon.stub(backendFetchModule, 'backendFetch');

  beforeAll(() => {
    nock.disableNetConnect();
  });
  afterEach(() => {
    sinon.resetHistory();
    sinon.resetBehavior();
  });
  afterAll(() => {
    nock.enableNetConnect();
    sinon.restore();
  });

  describe('fetch', () => {
    it('fetches full entity by id and sets aggregatesFrom', async() => {
      const aggregatesFrom = ['002'];
      const wrapper = factory({ entityId });

      backendFetch
        .withArgs('collections/retrieve', sinon.match.array, sinon.match.object)
        .resolves([{ aggregatesFrom }]);

      await wrapper.vm.fetch();

      expect(backendFetch.calledWith(
        'collections/retrieve', [[entityId], { fl: 'aggregatesFrom' }], {}
      )).toBe(true);
      expect(wrapper.vm.aggregatesFrom).toBe(aggregatesFrom);
    });
  });
});
