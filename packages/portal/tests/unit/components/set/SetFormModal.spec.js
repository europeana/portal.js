import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import VueI18n from 'vue-i18n';
import SetFormModal from '@/components/set/SetFormModal';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(VueI18n);

const storeDispatch = sinon.stub().resolves({});
const setApiCreateStub = sinon.stub().resolves({ id: '123' });
const setApiInsertItemStub = sinon.stub().resolves({});

const i18n = new VueI18n({
  locale: 'en'
});

const existingSetPropsData = {
  setId: '123',
  title: {
    en: 'My first public set'
  },
  description: {
    en: 'Lots of things in here'
  },
  visibility: 'public'
};

const factory = ({ propsData = {}, data = {} } = {}) => mount(SetFormModal, {
  localVue,
  propsData: {
    modalStatic: true,
    ...propsData
  },
  data() {
    return {
      ...data
    };
  },
  i18n,
  mocks: {
    $apis: {
      set: {
        create: setApiCreateStub,
        insertItem: setApiInsertItemStub
      }
    },
    $store: {
      dispatch: storeDispatch
    },
    $t: () => {}
  }
});

describe('components/set/SetFormModal', () => {
  afterEach(sinon.resetHistory);

  describe('form submission', () => {
    it('creates new sets', async() => {
      const wrapper = factory();

      await wrapper.find('#set-title').setValue('My first public set');
      await wrapper.find('#set-description').setValue('Lots of things in here');
      await wrapper.find('form').trigger('submit.stop.prevent');

      expect(setApiCreateStub.calledWith({
        type: 'Collection',
        collectionType: 'Gallery',
        title: {
          en: 'My first public set'
        },
        description: {
          en: 'Lots of things in here'
        },
        visibility: 'public'
      })).toBe(true);
    });

    it('updates existing sets', async() => {
      const wrapper = factory({ propsData: existingSetPropsData });

      await wrapper.find('#set-title').setValue('A better title');
      await wrapper.find('#set-private').setChecked();
      await wrapper.find('form').trigger('submit.stop.prevent');

      expect(storeDispatch.calledWith('set/update', {
        id: '123',
        body: {
          type: 'Collection',
          title: {
            en: 'A better title'
          },
          description: {
            en: 'Lots of things in here'
          },
          visibility: 'private'
        }
      })).toBe(true);
    });

    describe('when in item context', () => {
      const propsData = { itemContext: '/123/abc' };

      it('inserts item into set via API plugin', async() => {
        const wrapper = factory({ propsData });

        await wrapper.find('#set-title').setValue('My first public set');
        await wrapper.find('#set-description').setValue('Lots of things in here');
        await wrapper.find('form').trigger('submit.stop.prevent');
        await new Promise(process.nextTick);

        expect(setApiInsertItemStub.calledWith('123', '/123/abc')).toBe(true);
      });
    });
  });

  describe('delete button', () => {
    it('is not shown for new sets', async() => {
      const wrapper = factory();

      const deleteButton = wrapper.find('[data-qa="delete button"]');

      expect(deleteButton.exists()).toBe(false);
    });

    it('is shown for existing sets', async() => {
      const wrapper = factory({ propsData: existingSetPropsData });

      const deleteButton = wrapper.find('[data-qa="delete button"]');

      expect(deleteButton.exists()).toBe(true);
    });

    it('is not shown for existing sets when the user does NOT own the set', async() => {
      const wrapper = factory({ propsData: existingSetPropsData });

      await wrapper.setProps({ userIsOwner: false });

      const deleteButton = wrapper.find('[data-qa="delete button"]');

      expect(deleteButton.exists()).toBe(false);
    });

    it('opens the confirmation modal when pressed', () => {
      const wrapper = factory({ propsData: existingSetPropsData });
      const bvModalShow = sinon.spy(wrapper.vm.$bvModal, 'show');

      const deleteButton = wrapper.find('[data-qa="delete button"]');
      deleteButton.trigger('click');

      expect(bvModalShow.calledWith(`delete-set-modal-${existingSetPropsData.setId}`)).toBe(true);
    });
  });

  describe('create/update button', () => {
    describe('when there is a title value', () => {
      it('is disabled', async() => {
        const wrapper = factory({ propsData: existingSetPropsData });

        expect(wrapper.find('[data-qa="submit button"]').attributes('disabled')).toBe(undefined);
      });
    });

    describe('when there is no title value', () => {
      it('is disabled', async() => {
        const wrapper = factory();

        expect(wrapper.find('[data-qa="submit button"]').attributes('disabled')).toBe('disabled');
      });
    });

    describe('when the title value is removed', () => {
      it('is disabled', async() => {
        const wrapper = factory({ propsData: existingSetPropsData });

        await wrapper.find('#set-title').setValue('');

        expect(wrapper.find('[data-qa="submit button"]').attributes('disabled')).toBe('disabled');
      });
    });

    describe('when a title value is added', () => {
      it('is disabled', async() => {
        const wrapper = factory();

        await wrapper.find('#set-title').setValue('Title');

        expect(wrapper.find('[data-qa="submit button"]').attributes('disabled')).toBe(undefined);
      });
    });
  });

  describe('computed', () => {
    describe('hasTitleInSomeLanguage', () => {
      describe('when `titleValue` has text', () => {
        const data = {
          titleValue: 'fish'
        };

        it('is `true`', async() => {
          const wrapper = factory();

          await wrapper.setData(data);

          expect(wrapper.vm.hasTitleInSomeLanguage).toBe(true);
        });
      });

      describe('when `titleValue` has no text', () => {
        const data = {
          titleValue: ''
        };

        describe('but `title` has text for some language', () => {
          const propsData = { title: { es: 'pez' } };

          it('is `true`', async() => {
            const wrapper = factory({ propsData });

            await wrapper.setData(data);

            expect(wrapper.vm.hasTitleInSomeLanguage).toBe(true);
          });
        });

        describe('and `title` has no text for any language', () => {
          const propsData = { title: {} };

          it('is `true`', async() => {
            const wrapper = factory({ propsData });

            await wrapper.setData(data);

            expect(wrapper.vm.hasTitleInSomeLanguage).toBe(false);
          });
        });

        describe('and `title` has text for the current language', () => {
          describe('and `title` has text for some language', () => {
            const propsData = { title: { es: 'pez', en: 'fish' } };

            it('is `true`', async() => {
              const wrapper = factory({ propsData });

              await wrapper.setData(data);

              expect(wrapper.vm.hasTitleInSomeLanguage).toBe(true);
            });
          });

          describe('and `title` has no text for any language', () => {
            const propsData = { title: { en: 'fish' } };

            it('is `true`', async() => {
              const wrapper = factory({ propsData });

              await wrapper.setData(data);

              expect(wrapper.vm.hasTitleInSomeLanguage).toBe(false);
            });
          });
        });
      });
    });

    describe('visibilityValue', () => {
      describe('when `isPrivate` is `true`', () => {
        const data = {
          isPrivate: true
        };

        describe('and `visibility` is "private"', () => {
          const propsData = {
            visibility: 'private'
          };
          it('is "private"', async() => {
            const wrapper = factory({ propsData });

            await wrapper.setData(data);

            expect(wrapper.vm.visibilityValue).toBe('private');
          });
        });

        describe('and `visibility` is not "private"', () => {
          const propsData = {
            visibility: 'public'
          };
          it('is "private"', async() => {
            const wrapper = factory({ propsData });

            await wrapper.setData(data);

            expect(wrapper.vm.visibilityValue).toBe('private');
          });
        });
      });

      describe('when `isPrivate` is `false`', () => {
        const data = {
          isPrivate: false
        };

        describe('and `visibility` is "private"', () => {
          const propsData = {
            visibility: 'private'
          };
          it('is "public"', async() => {
            const wrapper = factory({ propsData });

            await wrapper.setData(data);

            expect(wrapper.vm.visibilityValue).toBe('public');
          });
        });

        describe('and `visibility` is "public"', () => {
          const propsData = {
            visibility: 'public'
          };
          it('is "public"', async() => {
            const wrapper = factory({ propsData });

            await wrapper.setData(data);

            expect(wrapper.vm.visibilityValue).toBe('public');
          });
        });

        describe('and `visibility` is "published"', () => {
          const propsData = {
            visibility: 'published'
          };
          it('is "published"', async() => {
            const wrapper = factory({ propsData });

            await wrapper.setData(data);

            expect(wrapper.vm.visibilityValue).toBe('published');
          });
        });
      });
    });
  });
});
