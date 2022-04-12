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
  dataProvider: ['Provider 123'],
  rights: ['http://creativecommons.org/publicdomain/mark/1.0/'],
  type: 'IMAGE'
};

const factory = (propsData) => {
  return shallowMount(ItemPreviewCard, {
    localVue,
    propsData,
    mocks: {
      $apis: {
        thumbnail: {
          edmPreview: (img) => img?.edmPreview?.[0],
          generic: (id) => id
        }
      },
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
    it('renders a default content card without any recommendation buttons', () => {
      const wrapper = factory({ item });

      expect(wrapper.vm.texts).toEqual([item.dcCreatorLangAware, item.dataProvider]);
    });
  });

  describe('similar items card', () => {
    it('renders a similar items content card without any recommendation buttons', () => {
      const wrapper = factory({ item, variant: 'similar' });

      expect(wrapper.vm.texts).toEqual([]);
    });
  });

  describe('mosaic card', () => {
    it('renders a mosaic content card without any recommendation buttons', () => {
      const wrapper = factory({ item, variant: 'mosaic' });

      expect(wrapper.vm.texts).toEqual([]);
    });
  });

  describe('explore card', () => {
    it('renders an explore content card without any recommendation buttons', () => {
      const wrapper = factory({ item, variant: 'explore' });

      expect(wrapper.vm.texts).toEqual([]);
    });
  });

  describe('list card', () => {
    describe('when hit-selector is present', () => {
      it('renders a list content card with hit-selector text', () => {
        const hitSelector = {
          exact: 'hit',
          field: 'rdf:value',
          prefix: 'Prefix text ',
          suffix: 'suffix text.'
        };
        const wrapper = factory({ item, variant: 'list', hitSelector });

        expect(wrapper.vm.texts).toEqual([]);
        expect(wrapper.vm.hitsText).toEqual(hitSelector);
      });
    });
    describe('when no hit-selector is present, but there is a description', () => {
      it('renders a list content card with description text', () => {
        const wrapper = factory({ item, variant: 'list' });

        expect(wrapper.vm.texts).toEqual([item.dcDescriptionLangAware]);
      });
    });
    it('renders a list content card with license label', () => {
      const wrapper = factory({ item, variant: 'list' });

      expect(wrapper.vm.rights).toEqual(item.rights[0]);
    });
    it('renders a list content card with type label', () => {
      const wrapper = factory({ item, variant: 'list' });

      expect(wrapper.vm.type).toEqual(item.type);
    });
  });
});
