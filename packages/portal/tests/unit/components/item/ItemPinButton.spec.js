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
const $goto = sinon.spy();
let storeEntityId = 'http://data.europeana.eu/topic/123';
let storeFeaturedSetId = 'http://data.europeana.eu/set/567';

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
        create: sinon.stub().resolves({ id: storeFeaturedSetId })
      }
    },
    $i18n: { locale: 'de' },
    $goto,
    $path: () => 'mocked path',
    $store: {
      commit: () => {},
      state: {
        entity: { entity: { id: storeEntityId }, pinned: [], ...storeState }
      },
      getters: {
        'entity/isPinned': storeIsPinnedGetter,
        'entity/featuredSetId': storeFeaturedSetId,
        'entity/id': storeEntityId
      },
      dispatch: storeDispatch
    },
    $t: (key) => key
  }
});

describe('components/item/ItemPinButton', () => {
  describe('template', () => {
    describe('when on an entity page', () => {
      beforeEach(() => {
        storeEntityId = 'http://data.europeana.eu/topic/123';
        storeFeaturedSetId = 'http://data.europeana.eu/set/567';
      });

      it('is visible', async() => {
        const wrapper = factory();

        const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');

        expect(pinButton.isVisible()).toBe(true);
      });

      it('does not contain text', async() => {
        const wrapper = factory();

        const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');

        expect(pinButton.text()).toBe('');
      });

      describe('when button with text', () => {
        it('contains text', async() => {
          const wrapper = factory();
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
          const wrapper = factory();
          it('pins the item', async() => {
            const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');
            await pinButton.trigger('click');

            expect(storeDispatchSuccess.calledWith('entity/pin')).toBe(true);
          });
          it('shows the pin toast', async() => {
            const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');
            await pinButton.trigger('click');

            expect(makeToastSpy.calledWith('entity.notifications.pinned')).toBe(true);
          });
          describe('when there is no set yet for the curated collection', () => {
            it('creates a set', async() => {
              storeFeaturedSetId = null;
              const wrapper = factory();

              const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');
              await pinButton.trigger('click');

              expect(wrapper.vm.$apis.set.create.called).toBe(true);
            });
          });
          describe('when the pin limit is reached', () => {
            it('shows the pinned limit modal', async() => {
              const wrapper = factory({ storeDispatch: sinon.stub().rejects({ message: 'too many pins' }) });
              const bvModalShow = sinon.spy(wrapper.vm.$bvModal, 'show');

              const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');
              await pinButton.trigger('click');

              expect(bvModalShow.calledWith(`pinned-limit-modal-${identifier}`)).toBe(true);
            });
          });
        });
      });
      describe('when item is pinned', () => {
        beforeEach(() => {
          storeIsPinnedGetter.returns(true);
        });

        it('button text is updated', async() => {
          const wrapper = factory();
          await wrapper.setProps({ buttonText: true });

          const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');
          expect(pinButton.text()).toBe('statuses.pinned');
        });

        describe('when pressed', () => {
          it('unpins the item', async() => {
            const wrapper = factory();

            const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');
            await pinButton.trigger('click');

            expect(storeDispatchSuccess.calledWith('entity/unpin')).toBe(true);
          });
          it('shows the pin toast', async() => {
            const wrapper = factory();

            const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');
            await pinButton.trigger('click');

            expect(makeToastSpy.calledWith('entity.notifications.unpinned')).toBe(true);
          });
        });
      });
    });

    describe('when on an entity-set page', () => {
      beforeEach(() => {
        storeEntityId = null;
        storeFeaturedSetId = 'http://data.europeana.eu/set/456';
      });

      it('is visible', async() => {
        const wrapper = factory();

        const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');

        expect(pinButton.isVisible()).toBe(true);
      });

      it('does not contain text', async() => {
        const wrapper = factory();

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

            const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');
            await pinButton.trigger('click');

            expect(storeDispatchSuccess.calledWith('entity/unpin')).toBe(true);
          });

          it('shows the pin toast', async() => {
            const wrapper = factory();

            const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');
            await pinButton.trigger('click');

            expect(makeToastSpy.calledWith('entity.notifications.unpinned')).toBe(true);
          });
        });
      });
    });

    describe('when on an item page', () => {
      beforeEach(() => {
        storeFeaturedSetId = null;
        storeEntityId = null;
      });

      describe('when the item has related entities', () => {
        it('is visible', async() => {
          const wrapper = factory();
          await wrapper.setProps({ entities: ['http://data.europeana.eu/topic/123'] });
          sinon.stub(wrapper.vm, 'entity').returns(false);

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

        expect($goto.calledWith('mocked path')).toBe(true);
      });
    });
  });
});
