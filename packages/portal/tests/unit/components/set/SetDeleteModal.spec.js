import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SetDeleteModal from '@/components/set/SetDeleteModal';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const setApiDeleteSpy = sinon.spy();
const storeDispatch = sinon.stub().resolves({});

const factory = (propsData = {}, route = { name: '' }) => mount(SetDeleteModal, {
  localVue,
  propsData: {
    modalStatic: true,
    ...propsData
  },
  mocks: {
    $apis: {
      set: { delete: setApiDeleteSpy }
    },
    $error: (error) => {
      console.error(error);
      throw error;
    },
    $store: {
      dispatch: storeDispatch
    },
    $route: route,
    $router: { push: sinon.spy() },
    $t: (key) => key,
    localePath: path => path
  }
});

describe('components/set/SetDeleteModal', () => {
  afterEach(sinon.resetHistory);

  it('shows a warning message', () => {
    const wrapper = factory({ setId: '123' });

    const modalText = wrapper.text();

    expect(modalText).toContain('set.actions.deleteset.prompts.delete');
  });

  describe('cancel button', () => {
    it('hides the modal', () => {
      const wrapper = factory({ setId: '123' });
      const bvModalHide = sinon.spy(wrapper.vm.$bvModal, 'hide');

      wrapper.find('[data-qa="close button"]').trigger('click');

      expect(bvModalHide.calledWith('delete-set-modal')).toBe(true);
    });

    it('does not delete the set!', () => {
      const wrapper = factory({ setId: '123' });

      wrapper.find('[data-qa="close button"]').trigger('click');

      expect(storeDispatch.called).toBe(false);
    });
  });

  describe('form submission', () => {
    it('deletes the set', async() => {
      const wrapper = factory({ setId: '123' });

      await wrapper.find('form').trigger('submit.stop.prevent');

      expect(setApiDeleteSpy.calledWith('123')).toBe(true);
    });

    it('resets the active set id in the store', async() => {
      const wrapper = factory({ setId: '123' });

      await wrapper.find('form').trigger('submit.stop.prevent');

      expect(storeDispatch.calledWith('set/setActive', null)).toBe(true);
    });

    it('hides the modal', async() => {
      const wrapper = factory({ setId: '123' });
      const bvModalHide = sinon.spy(wrapper.vm.$bvModal, 'hide');

      await wrapper.find('form').trigger('submit.stop.prevent');

      expect(bvModalHide.calledWith('delete-set-modal')).toBe(true);
    });

    it('makes toast', async() => {
      const wrapper = factory({ setId: '123' });
      const rootBvToast = sinon.spy(wrapper.vm.$root.$bvToast, 'toast');

      await wrapper.find('form').trigger('submit.stop.prevent');

      expect(rootBvToast.calledWith('set.notifications.deleted', sinon.match.any)).toBe(true);
    });

    describe('when on the deleted gallery page', () => {
      it('redirects to the account page', async() => {
        const wrapper = factory({ setId: 'http://data.europeana.eu/set/123' }, { name: 'galleries-all___fr', params: { pathMatch: '123' } });

        await wrapper.find('form').trigger('submit.stop.prevent');

        expect(wrapper.vm.$router.push.calledWith({ name: 'account' })).toBe(true);
      });
    });
  });
});
