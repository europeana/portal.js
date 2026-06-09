import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ItemPinButton from '@/components/item/ItemPinButton';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const identifier = '/123/abc';

const factory = ({ mocks = {}, provide = {}, storeState = {} } = {}) => shallowMount(ItemPinButton, {
  localVue,
  propsData: { identifier },
  provide,
  mocks: {
    $apis: {
      set: {
        create: sinon.stub().resolves({}),
        get: sinon.stub().resolves({}),
        getItemIds: sinon.stub().resolves([]),
        search: sinon.stub().resolves({}),
        deleteItems: sinon.spy(),
        pinItem: sinon.spy()
      }
    },
    $auth: {},
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
      }
    },
    $t: (key) => key,
    ...mocks
  }
});

describe('components/item/ItemPinButton', () => {
  afterEach(sinon.resetHistory);

  describe('template', () => {
    describe('when not logged-in', () => {
      const $auth = {
        loggedIn: false,
        userHasClientRole: sinon.stub().returns(false)
      };

      it('is not rendered', () => {
        const wrapper = factory({ mocks: { $auth } });

        const buttonWrapper = wrapper.find('.pin-button-wrapper');

        expect(buttonWrapper.exists()).toBe(false);
      });
    });

    describe('when logged-in but not authorised to pin', () => {
      const $auth = {
        loggedIn: true,
        userHasClientRole: sinon.stub().returns(false)
      };

      it('is not rendered', () => {
        const wrapper = factory({ mocks: { $auth } });

        const buttonWrapper = wrapper.find('.pin-button-wrapper');

        expect(buttonWrapper.exists()).toBe(false);
      });
    });

    describe('when logged-in and authorised to pin', () => {
      const $auth = {
        loggedIn: true,
        userHasClientRole: sinon.stub().returns(false)
          .withArgs('entities', 'editor').returns(true)
          .withArgs('usersets', 'editor').returns(true)
      };

      describe('when on an entity page', () => {
        const storeState = { id: 'http://data.europeana.eu/topic/123' };

        it('is visible', async() => {
          const wrapper = factory({ mocks: { $auth }, storeState });

          const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');

          expect(pinButton.isVisible()).toBe(true);
        });

        it('does not contain text', async() => {
          const wrapper = factory({ mocks: { $auth }, storeState });

          const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');

          expect(pinButton.text()).toBe('');
        });

        describe('when button with text', () => {
          it('contains text', async() => {
            const wrapper = factory({ mocks: { $auth }, storeState });
            await wrapper.setProps({ buttonText: true });

            const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');

            expect(pinButton.text()).toBe('actions.pin');
          });
        });

        describe('when item is not pinned', () => {
          const storeState = { pinned: [], id: 'http://data.europeana.eu/topic/123' };

          describe('when pressed', () => {
            it('ensures the set exists', async() => {
              const wrapper = factory({ mocks: { $auth }, storeState });
              sinon.spy(wrapper.vm, 'ensureEntityBestItemsSetExists');

              const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');
              await pinButton.trigger('click');

              expect(wrapper.vm.ensureEntityBestItemsSetExists.called).toBe(true);
            });

            it('pins the item', async() => {
              const wrapper = factory({ mocks: { $auth }, storeState });
              sinon.spy(wrapper.vm, 'pinItemToEntityBestItemsSet');

              const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');
              await pinButton.trigger('click');

              expect(wrapper.vm.pinItemToEntityBestItemsSet.called).toBe(true);
            });
          });
        });
        describe('when item is pinned', () => {
          const storeState = { pinned: [identifier], id: 'http://data.europeana.eu/topic/123' };

          it('button text is updated', async() => {
            const wrapper = factory({ mocks: { $auth }, storeState });
            await wrapper.setProps({ buttonText: true });

            const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');
            expect(pinButton.text()).toBe('statuses.pinned');
          });

          describe('when pressed', () => {
            it('unpins the item', async() => {
              const wrapper = factory({ mocks: { $auth }, storeState });
              sinon.spy(wrapper.vm, 'unpinItemFromEntityBestItemsSet');

              const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');
              await pinButton.trigger('click');

              expect(wrapper.vm.unpinItemFromEntityBestItemsSet.called).toBe(true);
            });
          });
        });
      });

      describe('when provided a currentSet', () => {
        describe('that is not an EntityBestItemsSet', () => {
          const provide = { currentSet: { id: 'http://data.europeana.eu/set/1234', type: 'Collection' } };

          it('is not rendered', () => {
            const wrapper = factory({ mocks: { $auth }, provide });

            const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');

            expect(pinButton.exists()).toBe(false);
          });
        });

        describe('that is an EntityBestItemsSet', () => {
          const provide = { currentSet: { id: 'http://data.europeana.eu/set/1234', type: 'EntityBestItemsSet' } };

          it('is visible', () => {
            const wrapper = factory({ mocks: { $auth }, provide });

            const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');

            expect(pinButton.isVisible()).toBe(true);
          });

          it('does not contain text', () => {
            const wrapper = factory({ mocks: { $auth }, provide });

            const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');

            expect(pinButton.text()).toBe('');
          });

          describe('when item is pinned', () => {
            const storeState = { pinned: [identifier] };

            describe('when pressed', () => {
              it('unpins the item', async() => {
                const wrapper = factory({ mocks: { $auth }, provide, storeState });
                sinon.spy(wrapper.vm, 'unpinItemFromEntityBestItemsSet');

                const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');
                await pinButton.trigger('click');

                expect(wrapper.vm.unpinItemFromEntityBestItemsSet.called).toBe(true);
              });
            });
          });
        });
      });

      describe('when on an item page', () => {
        describe('when the item has related entities', () => {
          const provide = { itemPinning: { entities: ['http://data.europeana.eu/topic/123'] } };

          it('is visible', () => {
            const wrapper = factory({ mocks: { $auth }, provide });

            const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');

            expect(pinButton.isVisible()).toBe(true);
          });

          describe('when clicked', () => {
            it('opens the modal', async() => {
              const wrapper = factory({ mocks: { $auth }, provide });
              const bvModalShow = sinon.spy(wrapper.vm.$bvModal, 'show');

              const pinButton = wrapper.find('b-button-stub[data-qa="pin button"]');
              await pinButton.trigger('click');

              expect(bvModalShow.calledWith(`pin-modal-${identifier}`)).toBe(true);
            });
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
