import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import VueI18n from 'vue-i18n';
import EntityUpdateModal from '@/components/entity/EntityUpdateModal';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(VueI18n);

const storeDispatch = sinon.stub().resolves({});
import messages from '@/lang/en';

const i18n = new VueI18n({
  locale: 'en',
  messages: {
    en: messages
  }
});

const existingEntityPropsData = {
  description: 'A form of communication',
  body: {
    id: '1-art',
    type: 'concept',
    prefLabel: {
      en: 'Art'
    },
    note: {
      en: ['A form of communication', 'A book is a medium for recording information']
    }
  }
};

const factory = (propsData = {}) => mount(EntityUpdateModal, {
  localVue,
  propsData: {
    modalStatic: true,
    ...propsData
  },
  i18n,
  mocks: {
    $store: {
      dispatch: storeDispatch
    }
  }
});

describe('components/entity/EntityUpdateModal', () => {
  describe('form submission', () => {
    it('updates existing entity', async() => {
      const wrapper = factory(existingEntityPropsData);
      await wrapper.find('#entity-description').setValue('Updated');
      await wrapper.find('form').trigger('submit.stop.prevent');

      expect(storeDispatch.calledWith('entity/update', {
        id: '1-art',
        body: {
          type: 'concept',
          prefLabel: {
            en: 'Art'
          },
          note: {
            en: ['Updated']
          }
        }
      }));
    });
    it('hides the modal', async() => {
      const wrapper = factory(existingEntityPropsData);
      const bvModalHide = sinon.spy(wrapper.vm.$bvModal, 'hide');

      await wrapper.find('form').trigger('submit.stop.prevent');

      expect(bvModalHide.calledWith('entityUpdateModal')).toBe(true);
    });

    it('makes toast', async() => {
      const wrapper = factory(existingEntityPropsData);
      const rootBvToast = sinon.spy(wrapper.vm.$root.$bvToast, 'toast');

      await wrapper.find('form').trigger('submit.stop.prevent');

      expect(rootBvToast.calledWith('The collection has been updated', sinon.match.any)).toBe(true);
    });
  });

  describe('update button', () => {
    describe('when there is no description update', () => {
      it('is disabled', () => {
        const wrapper = factory(existingEntityPropsData);

        wrapper.find('#entity-description').setValue(existingEntityPropsData.description);
        expect(wrapper.find('[data-qa="submit button"]').attributes('disabled')).toBe('disabled');
      });
    });
    describe('when description is filled with emptry string', () => {
      it('is disabled', () => {
        const wrapper = factory({ description: undefined });

        wrapper.find('#entity-description').setValue('');

        expect(wrapper.find('[data-qa="submit button"]').attributes('disabled')).toBe('disabled');
      });
    });
  });
});
