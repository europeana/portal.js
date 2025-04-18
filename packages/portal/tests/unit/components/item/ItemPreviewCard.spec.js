import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ItemPreviewCard from '@/components/item/ItemPreviewCard.vue';

import sinon from 'sinon';
const localVue = createLocalVue();
localVue.use(BootstrapVue);
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

const factory = ({ mocks, parentComponent, propsData } = {}) => {
  return shallowMount(ItemPreviewCard, {
    localVue,
    parentComponent,
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
      $route: { query: {} },
      $t: () => {},
      $store: {
        getters: {
          'entity/isPinned': storeIsPinnedGetter
        }
      },
      ...mocks
    },
    stubs: ['ContentCard', 'ItemSelectCheckbox', 'UserButtons']
  });
};

describe('components/item/ItemPreviewCard', () => {
  describe('default card', () => {
    it('renders a default content card without any recommendation buttons', () => {
      const wrapper = factory({ propsData: { item } });

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
        const wrapper = factory({ propsData: { item, variant: 'list', hitSelector } });

        expect(wrapper.vm.texts).toEqual([]);
        expect(wrapper.vm.hitText).toEqual(hitSelector);
      });
    });
    describe('when no hit-selector is present, but there is a description', () => {
      it('renders a list content card with description text', () => {
        const wrapper = factory({ propsData: { item, variant: 'list' } });

        expect(wrapper.vm.texts).toEqual([item.dcDescriptionLangAware]);
      });
    });
    it('renders a list content card with license label', () => {
      const wrapper = factory({ propsData: { item, variant: 'list' } });

      expect(wrapper.vm.rights).toEqual(item.rights[0]);
    });
    it('renders a list content card with type label', () => {
      const wrapper = factory({ propsData: { item, variant: 'list' } });

      expect(wrapper.vm.type).toEqual(item.type);
    });
  });

  describe('event listeners', () => {
    describe('onClickCard', () => {
      it('is called with item ID when card receives `click` event', () => {
        const onClickCard = sinon.spy();
        const wrapper = factory({ propsData: { item, onClickCard } });

        wrapper.vm.$refs.card.$el.dispatchEvent(new Event('click'));

        expect(onClickCard.calledWith(item.id)).toBe(true);
      });
    });

    describe('onAuxClickCard', () => {
      it('is called with item ID when card receives `click` event', () => {
        const onAuxClickCard = sinon.spy();
        const wrapper = factory({ propsData: { item, onAuxClickCard } });

        wrapper.vm.$refs.card.$el.dispatchEvent(new Event('auxclick'));

        expect(onAuxClickCard.calledWith(item.id)).toBe(true);
      });
    });
  });

  describe('item multi select', () => {
    describe('when switched on, via inject', () => {
      it('renders a checkbox, hides the user buttons and removes the item link', () => {
        const parentComponent = {
          provide() {
            return { itemMultiSelect: true };
          }
        };
        const wrapper = factory({ parentComponent, propsData: { item } });

        expect(wrapper.find('itemselectcheckbox-stub').exists()).toBe(true);
        expect(wrapper.find('userbuttons-stub').exists()).toBe(false);
        expect(wrapper.find('contentcard-stub').attributes('url')).toEqual('');
      });
    });
  });
});
