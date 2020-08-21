import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import VueI18n from 'vue-i18n';
import SetFormModal from '../../../../components/set/SetFormModal';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(VueI18n);

const createSet = sinon.stub().resolves({});
const updateSet = sinon.stub().resolves({});

const i18n = new VueI18n({
  locale: 'en'
});

const factory = (propsData = {}) => mount(SetFormModal, {
  localVue,
  propsData: {
    modalStatic: true,
    ...propsData
  },
  i18n,
  mocks: {
    $sets: {
      createSet,
      updateSet
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

      createSet.should.have.been.calledWith({
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
      const wrapper = factory({
        setId: '123',
        title: {
          en: 'My first public set'
        },
        description: {
          en: 'Lots of things in here'
        },
        visibility: 'public'
      });

      await wrapper.find('#set-title').setValue('A better title');
      await wrapper.find('#set-private').setChecked();
      await wrapper.find('form').trigger('submit.stop.prevent');

      updateSet.should.have.been.calledWith('123', {
        type: 'Collection',
        title: {
          en: 'A better title'
        },
        description: {
          en: 'Lots of things in here'
        },
        visibility: 'private'
      });
    });
  });
});
