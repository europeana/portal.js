import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ItemPreviewCard from '@/components/item/ItemPreviewCard.vue';

import sinon from 'sinon';
const localVue = createLocalVue();
localVue.use(BootstrapVue);
const storeIsLikedGetter = sinon.stub();
const storeIsPinnedGetter = sinon.stub();

const item = {
  id: '/123/abc',
  dcTitleLangAware: { def: ['Record 123/abc'] },
  dcCreatorLangAware: { def: ['Creator Name'] },
  dcDescriptionLangAware: { def: ['Item Description'] },
  edmPreview: ['https://www.example.org/abc.jpg'],
  dataProvider: 'Provider 123'
};

const factory = (propsData) => {
  return shallowMount(ItemPreviewCard, {
    localVue,
    propsData,
    mocks: {
      $auth: { loggedIn: false },
      $config: { app: { internalLinkDomain: null } },
      $path: (opts) => `/item/${opts.params.pathMatch}`,
      $i18n: {
        locale: 'en'
      },
      $t: () => {},
      $store: {
        state: {
          set: { ...{ liked: [] }, ...{} }
        },
        getters: {
          'set/isLiked': storeIsLikedGetter,
          'entity/isPinned': storeIsPinnedGetter
        }
      }
    }
  });
};

describe('components/item/ItemPreviewCard', () => {
  describe('default card', () => {
    it('renders a default content card without any recommendation buttons', async() => {
      const wrapper = factory({ item });

      expect(wrapper.vm.texts).toEqual([item.dcCreatorLangAware, item.dataProvider]);
    });
  });
});
