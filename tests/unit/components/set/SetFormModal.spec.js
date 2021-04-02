import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import VueI18n from 'vue-i18n';
import SetFormModal from '../../../../src/components/set/SetFormModal';
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

const factory = (propsData = {}) => mount(SetFormModal, {
  localVue,
  propsData: {
    modalStatic: true,
    ...propsData
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

      storeDispatch.should.have.been.calledWith('set/createSet', {
        type: 'Collection',
        title: {
          en: 'My first public set'
        },
        description: {
          en: 'Lots of things in here'
        },
        visibility: 'public'
      });
    });

    it('updates existing sets', async() => {
      const wrapper = factory(existingSetPropsData);

      await wrapper.find('#set-title').setValue('A better title');
      await wrapper.find('#set-private').setChecked();
      await wrapper.find('form').trigger('submit.stop.prevent');

      storeDispatch.should.have.been.calledWith('set/updateSet', {
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
      });
    });
  });

  describe('delete button', () => {
    it('is not shown for new sets', async() => {
      const wrapper = factory();

      const deleteButton = wrapper.find('[data-qa="delete button"]');

      deleteButton.exists().should.be.false;
    });

    it('is shown for existing sets', async() => {
      const wrapper = factory(existingSetPropsData);

      const deleteButton = wrapper.find('[data-qa="delete button"]');

      deleteButton.exists().should.be.true;
    });

    it('opens the confirmation modal when pressed', () => {
      const wrapper = factory(existingSetPropsData);
      const bvModalShow = sinon.spy(wrapper.vm.$bvModal, 'show');

      const deleteButton = wrapper.find('[data-qa="delete button"]');
      deleteButton.trigger('click');

      bvModalShow.should.have.been.calledWith(`delete-set-modal-${existingSetPropsData.setId}`);
    });
  });
});
