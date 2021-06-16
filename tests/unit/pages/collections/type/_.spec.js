/* import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../../utils';
import BootstrapVue from 'bootstrap-vue';

import collection from '../../../../../src/pages/collections/_type/_';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMountNuxt(collection, {
  localVue,
  mocks: {
    $t: key => key,
    $route: { query: '', params: { type: 'organisation' } },
    data() {
      return {
        entity: {},
        page: {}
      };
    },
    $store: {
      state: {
        entity: {}
      }
    }
  }
});

describe('Collection page', () => {
  describe('collectionType()', () => {
    it('returns the collection type', () => {
      const wrapper = factory();

      // const collectionType = wrapper.vm.collectionType();
      // collectionType.should.eq(1);
    });
  });
}); */
