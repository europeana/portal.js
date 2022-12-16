import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import PublishSetButton from '@/components/set/PublishSetButton';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const storeDispatch = sinon.stub().resolves({});

const publicSet = { setId: '001', visibility: 'public' };

const publishedSet = { setId: '001', visibility: 'published' };

const factory = (propsData = {}) => shallowMount(PublishSetButton, {
  localVue,
  propsData: {
    ...propsData
  },
  mocks: {
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

describe('components/set/PublishSetButton', () => {
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

      expect(storeDispatch.calledWith('set/publish', publicSet.setId)).toBe(false);
      expect(storeDispatch.calledWith('set/unpublish', publicSet.setId)).toBe(false);
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

      expect(storeDispatch.calledWith('set/publish', publicSet.setId)).toBe(true);
    });
  });

  describe('when set is already published', () => {
    it('unpublishes the set', async() => {
      const wrapper = factory(publishedSet);

      await wrapper.find('[data-qa="publish set button"]').trigger('click');

      expect(storeDispatch.calledWith('set/unpublish', publicSet.setId)).toBe(true);
    });
  });
});
