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
      localePath: (opts) => `/item/${opts.params.pathMatch}`,
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
        expect(wrapper.vm.hitText).toEqual(hitSelector);
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

  describe('event listeneres', () => {
    describe('onClickCard', () => {
      it('is called with item ID when card receives `click` event', () => {
        const onClickCard = sinon.spy();
        const wrapper = factory({ item, onClickCard });

        wrapper.vm.$refs.card.$el.dispatchEvent(new Event('click'));

        expect(onClickCard.calledWith(item.id)).toBe(true);
      });
    });

    describe('onAuxClickCard', () => {
      it('is called with item ID when card receives `click` event', () => {
        const onAuxClickCard = sinon.spy();
        const wrapper = factory({ item, onAuxClickCard });

        wrapper.vm.$refs.card.$el.dispatchEvent(new Event('auxclick'));

        expect(onAuxClickCard.calledWith(item.id)).toBe(true);
      });
    });
  });
});
