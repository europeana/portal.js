import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import VueI18n from 'vue-i18n';
import SetFormModal from '@/components/set/SetFormModal';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(VueI18n);

const storeDispatch = sinon.stub().resolves({});

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
    $store: {
      dispatch: storeDispatch
    },
    $t: () => {}
  }
});

describe('components/set/SetFormModal', () => {
  describe('form submission', () => {
    it('creates new sets', async() => {
      const wrapper = factory();

      await wrapper.find('#set-title').setValue('My first public set');
      await wrapper.find('#set-description').setValue('Lots of things in here');
      await wrapper.find('form').trigger('submit.stop.prevent');

      expect(storeDispatch.calledWith('set/createSet', {
        type: 'Collection',
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

    it('opens the confirmation modal when pressed', () => {
      const wrapper = factory({ propsData: existingSetPropsData });
      const bvModalShow = sinon.spy(wrapper.vm.$bvModal, 'show');

      const deleteButton = wrapper.find('[data-qa="delete button"]');
      deleteButton.trigger('click');

      expect(bvModalShow.calledWith(`delete-set-modal-${existingSetPropsData.setId}`)).toBe(true);
    });
  });

  describe('create/update button', () => {
    describe('when there is no value for title', () => {
      it('is disabled', () => {
        const wrapper = factory();

        wrapper.find('#set-title').setValue('');

        expect(wrapper.find('[data-qa="submit button"]').attributes('disabled')).toBe('disabled');
      });
    });
    describe('when there are no updates made', () => {
      it('is disabled', () => {
        const wrapper = factory({ propsData: existingSetPropsData });

        wrapper.find('#set-title').setValue(existingSetPropsData.title.en);
        wrapper.find('#set-description').setValue(existingSetPropsData.description.en);
        wrapper.find('#set-private').setChecked(false);

        expect(wrapper.find('[data-qa="submit button"]').attributes('disabled')).toBe('disabled');
      });
    });
    describe('when description is filled with emptry string', () => {
      it('is disabled', () => {
        const wrapper = factory({ propsData: { description: { en: undefined } } });

        wrapper.find('#set-description').setValue('');

        expect(wrapper.find('[data-qa="submit button"]').attributes('disabled')).toBe('disabled');
      });
    });
  });

  describe('computed', () => {
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
