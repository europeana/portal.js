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
      dispatch: storeDispatch
    }
  }
});

describe('components/set/PublishSetButton', () => {
  describe('When set is not published', () => {
    it('publishes the set', async() => {
      const wrapper = factory(publicSet);

      await wrapper.find('[data-qa="publish set button"]').trigger('click');

      expect(storeDispatch.calledWith('set/publish', publicSet.setId)).toBe(true);
    });
  });

  describe('When set is already published', () => {
    it('unpublishes the set', async() => {
      const wrapper = factory(publishedSet);

      await wrapper.find('[data-qa="publish set button"]').trigger('click');

      expect(storeDispatch.calledWith('set/unpublish', publicSet.setId)).toBe(true);
    });
  });
});
