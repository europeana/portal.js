import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ItemPinButton from '@/components/item/ItemPinButton';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const identifier = '/123/abc';
const storeDispatchSuccess = sinon.spy();
const storeIsPinnedGetter = sinon.stub();
const makeToastSpy = sinon.spy();

const mixins = [
  {
    methods: {
      makeToast: makeToastSpy
    }
  }
];

const factory = ({ storeState = {}, storeDispatch = storeDispatchSuccess } = {}) => shallowMount(ItemPinButton, {
  localVue,
  propsData: { identifier },
  mixins,
  mocks: {
    $apis: {
      set: {
        create: sinon.stub().resolves({}),
        getWithItems: sinon.stub().resolves({}),
        search: sinon.stub().resolves({}),
        deleteItem: sinon.spy(),
        pinItem: sinon.spy()
      }
    },
    $error: (error) => {
      console.error(error);
      throw error;
    },
    $i18n: { locale: 'de' },
    $router: { push: sinon.spy() },
    localePath: () => 'mocked path',
    $store: {
      commit: () => {},
      state: {
        entity: { entity: { id: 'http://data.europeana.eu/topic/123' }, pinned: [], ...storeState }
      },
      getters: {
        'entity/isPinned': storeIsPinnedGetter
      },
      dispatch: storeDispatch
    },
    $t: (key) => key
  }
});

describe('components/item/ItemPinButton', () => {
  afterEach(sinon.resetHistory);

  describe('template', () => {
    describe('when on an entity page', () => {
      const storeState = { id: 'http://data.europeana.eu/topic/123' };

      it('is visible', async() => {
        const wrapper = factory({ storeState });

        const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');

        expect(pinButton.isVisible()).toBe(true);
      });

      it('does not contain text', async() => {
        const wrapper = factory({ storeState });

        const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');

        expect(pinButton.text()).toBe('');
      });

      describe('when button with text', () => {
        it('contains text', async() => {
          const wrapper = factory({ storeState });
          await wrapper.setProps({ buttonText: true });

          const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');

          expect(pinButton.text()).toBe('actions.pin');
        });
      });

      describe('when item is not pinned', () => {
        beforeEach(() => {
          storeIsPinnedGetter.returns(false);
        });

        describe('when pressed', () => {
          it('ensures the set exists', async() => {
            const wrapper = factory({ storeState });
            sinon.spy(wrapper.vm, 'ensureEntityBestItemsSetExists');

            const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');
            await pinButton.trigger('click');

            expect(wrapper.vm.ensureEntityBestItemsSetExists.called).toBe(true);
          });

          it('pins the item', async() => {
            const wrapper = factory({ storeState });
            sinon.spy(wrapper.vm, 'pinItemToEntityBestItemsSet');

            const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');
            await pinButton.trigger('click');

            expect(wrapper.vm.pinItemToEntityBestItemsSet.called).toBe(true);
          });
        });
      });
      describe('when item is pinned', () => {
        beforeEach(() => {
          storeIsPinnedGetter.returns(true);
        });

        it('button text is updated', async() => {
          const wrapper = factory({ storeState });
          await wrapper.setProps({ buttonText: true });

          const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');
          expect(pinButton.text()).toBe('statuses.pinned');
        });

        describe('when pressed', () => {
          it('unpins the item', async() => {
            const wrapper = factory({ storeState });
            sinon.spy(wrapper.vm, 'unpinItemFromEntityBestItemsSet');

            const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');
            await pinButton.trigger('click');

            expect(wrapper.vm.unpinItemFromEntityBestItemsSet.called).toBe(true);
          });
        });
      });
    });

    describe('when on an entity-set page', () => {
      it('is visible', async() => {
        const wrapper = factory();
        wrapper.vm.$store.state.entity.bestItemsSetId = 1;

        const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');

        expect(pinButton.isVisible()).toBe(true);
      });

      it('does not contain text', async() => {
        const wrapper = factory();
        wrapper.vm.$store.state.entity.bestItemsSetId = 1;

        const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');

        expect(pinButton.text()).toBe('');
      });

      describe('when item is pinned', () => {
        beforeEach(() => {
          storeIsPinnedGetter.returns(true);
        });

        describe('when pressed', () => {
          it('unpins the item', async() => {
            const wrapper = factory();
            wrapper.vm.$store.state.entity.bestItemsSetId = 1;
            sinon.spy(wrapper.vm, 'unpinItemFromEntityBestItemsSet');

            const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');
            await pinButton.trigger('click');

            expect(wrapper.vm.unpinItemFromEntityBestItemsSet.called).toBe(true);
          });
        });
      });
    });

    describe('when on an item page', () => {
      describe('when the item has related entities', () => {
        it('is visible', async() => {
          const wrapper = factory();
          await wrapper.setProps({ entities: ['http://data.europeana.eu/topic/123'] });

          const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');

          expect(pinButton.isVisible()).toBe(true);
        });

        describe('when clicked', () => {
          it('opens the modal', async() => {
            const wrapper = factory();
            await wrapper.setProps({ entities: ['http://data.europeana.eu/topic/123'] });
            const bvModalShow = sinon.spy(wrapper.vm.$bvModal, 'show');

            const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');
            await pinButton.trigger('click');

            expect(bvModalShow.calledWith(`pin-modal-${identifier}`)).toBe(true);
          });
        });
      });
    });
  });

  describe('methods', () => {
    describe('goToPins', () => {
      it('links to pins page', async() => {
        const wrapper = factory();
        await wrapper.vm.goToPins();

        expect(wrapper.vm.$router.push.calledWith('mocked path')).toBe(true);
      });
    });
  });
});
