import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SetDeleteModal from '@/components/set/SetDeleteModal';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const setApiDeleteSpy = sinon.spy();
const storeDispatch = sinon.stub().resolves({});

const setId = 'http://data.europeana.eu/set/123';

const factory = ({ propsData, $route, $store } = {}) => mount(SetDeleteModal, {
  localVue,
  propsData: {
    modalStatic: true,
    setId,
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
      dispatch: storeDispatch,
      state: {
        set: { active: { id: null } }
      },
      ...$store
    },
    $route: {
      name: 'galleries-all___fr',
      params: { pathMatch: '123' },
      ...$route
    },
    $router: { push: sinon.spy() },
    $t: (key) => key,
    localePath: path => path
  }
});

describe('components/set/SetDeleteModal', () => {
  afterEach(sinon.resetHistory);

  it('shows a warning message', () => {
    const wrapper = factory();

    const modalText = wrapper.text();

    expect(modalText).toContain('set.actions.deleteset.prompts.delete');
  });

  describe('cancel button', () => {
    it('hides the modal', () => {
      const wrapper = factory();
      const bvModalHide = sinon.spy(wrapper.vm.$bvModal, 'hide');

      wrapper.find('[data-qa="close button"]').trigger('click');

      expect(bvModalHide.calledWith('delete-set-modal')).toBe(true);
    });

    it('does not delete the set!', () => {
      const wrapper = factory();

      wrapper.find('[data-qa="close button"]').trigger('click');

      expect(storeDispatch.called).toBe(false);
    });
  });

  describe('form submission', () => {
    it('deletes the set', async() => {
      const wrapper = factory();

      await wrapper.find('form').trigger('submit.stop.prevent');

      expect(setApiDeleteSpy.calledWith(setId)).toBe(true);
    });

    describe('when the active set', () => {
      const $store = { state: { set: { active: { id: setId } } } };

      it('resets the active set id in the store', async() => {
        const wrapper = factory({ $store });

        await wrapper.find('form').trigger('submit.stop.prevent');

        expect(storeDispatch.calledWith('set/setActive', null)).toBe(true);
      });
    });

    describe('when not the active set', () => {
      const $store = { state: { set: { active: { id: 'http://data.europeana.eu/set/456' } } } };

      it('does not reset the active set id in the store', async() => {
        const wrapper = factory({ $store });

        await wrapper.find('form').trigger('submit.stop.prevent');

        expect(storeDispatch.called).toBe(false);
      });
    });

    it('hides the modal', async() => {
      const wrapper = factory();
      const bvModalHide = sinon.spy(wrapper.vm.$bvModal, 'hide');

      await wrapper.find('form').trigger('submit.stop.prevent');

      expect(bvModalHide.calledWith('delete-set-modal')).toBe(true);
    });

    it('makes toast', async() => {
      const wrapper = factory();
      const rootBvToast = sinon.spy(wrapper.vm.$root.$bvToast, 'toast');

      await wrapper.find('form').trigger('submit.stop.prevent');

      expect(rootBvToast.calledWith('set.notifications.deleted', sinon.match.any)).toBe(true);
    });

    describe('when on the deleted gallery page', () => {
      it('redirects to the account page', async() => {
        const wrapper = factory({ $route: { name: 'galleries-all___fr', params: { pathMatch: '123' } } });

        await wrapper.find('form').trigger('submit.stop.prevent');

        expect(wrapper.vm.$router.push.calledWith({ name: 'account' })).toBe(true);
      });
    });
  });
});
