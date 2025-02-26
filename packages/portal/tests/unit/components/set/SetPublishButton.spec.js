import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SetPublishButton from '@/components/set/SetPublishButton';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const storeDispatch = sinon.stub().resolves({});
const setApiPublishSpy = sinon.spy();
const setApiUnpublishSpy = sinon.spy();

const publicSet = { setId: '001', visibility: 'public' };

const publishedSet = { setId: '001', visibility: 'published' };

const factory = (propsData = {}) => shallowMount(SetPublishButton, {
  localVue,
  propsData: {
    ...propsData
  },
  mocks: {
    $apis: {
      set: {
        publish: setApiPublishSpy,
        unpublish: setApiUnpublishSpy
      }
    },
    $t: key => key,
    $store: {
      dispatch: storeDispatch,
      state: {
        set: {
          active: {
            visibility: propsData.visibility
          }
        }
      }
    }
  }
});

describe('components/set/SetPublishButton', () => {
  afterEach(sinon.resetHistory);

  it('refreshes the active set first', async() => {
    const wrapper = factory(publicSet);

    await wrapper.find('[data-qa="publish set button"]').trigger('click');

    expect(storeDispatch.calledWith('set/fetchActive', publicSet.setId)).toBe(true);
  });

  describe('when set visibility changed in the meantime', () => {
    it('does not try to change the set visibility again', async() => {
      const wrapper = factory(publicSet);
      wrapper.vm.$store.state.set.active.visibility = 'private';

      await wrapper.find('[data-qa="publish set button"]').trigger('click');

      expect(setApiPublishSpy.called).toBe(false);
      expect(setApiUnpublishSpy.called).toBe(false);
    });

    it('shows a toast with a notification', async() => {
      const wrapper = factory(publicSet);
      wrapper.vm.$store.state.set.active.visibility = 'private';
      sinon.spy(wrapper.vm, 'makeToast');

      await wrapper.find('[data-qa="publish set button"]').trigger('click');

      expect(wrapper.vm.makeToast.called).toBe(true);
    });
  });

  describe('when set is not published', () => {
    it('publishes the set', async() => {
      const wrapper = factory(publicSet);

      await wrapper.find('[data-qa="publish set button"]').trigger('click');

      expect(setApiPublishSpy.called).toBe(true);
    });

    it('refreshes the set in the store', async() => {
      const wrapper = factory(publicSet);

      await wrapper.find('[data-qa="publish set button"]').trigger('click');

      expect(storeDispatch.calledWith('set/refreshSet')).toBe(true);
    });
  });

  describe('when set is already published', () => {
    it('unpublishes the set', async() => {
      const wrapper = factory(publishedSet);

      await wrapper.find('[data-qa="publish set button"]').trigger('click');

      expect(setApiUnpublishSpy.calledWith(publicSet.setId)).toBe(true);
    });

    it('refreshes the set in the store', async() => {
      const wrapper = factory(publishedSet);

      await wrapper.find('[data-qa="publish set button"]').trigger('click');

      expect(storeDispatch.calledWith('set/refreshSet')).toBe(true);
    });
  });
});
