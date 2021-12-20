import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import RecommendationButtons from '@/components/recommendation/RecommendationButtons';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const identifier = '/123/abc';
const setId = '/123/def';
const storeDispatch = sinon.spy();

const factory = ({ storeState = {}, $auth = {}, recommendationFlag = false } = {}) => mount(RecommendationButtons, {
  localVue,
  propsData: { identifier, recommendedItem: recommendationFlag },
  mocks: {
    $auth,
    $store: {
      state: {
        set: { ...storeState }
      },
      dispatch: storeDispatch
    },
    $route: {
      params: { pathMatch: '123/def' }
    },
    $t: () => {}
  }
});

describe('components/recommendation/RecommendationButtons', () => {
  describe('accept button', () => {
    it('is visible', () => {
      const wrapper = factory({ recommendationFlag: true });

      const acceptButton = wrapper.find('[data-qa="accept button"]');

      acceptButton.isVisible().should.be.true;
    });

    context('when user is logged in', () => {
      const $auth = { loggedIn: true };

      context('when pressed', () => {
        it('dispatches to accept recommended item', async() => {
          const wrapper = factory({ $auth, recommendationFlag: true });

          const acceptButton = wrapper.find('[data-qa="accept button"]');
          acceptButton.trigger('click');

          storeDispatch.should.have.been.calledWith('set/reviewRecommendation', { setId, itemIds: ['/123/abc'], action: 'accept' });
          storeDispatch.should.have.been.calledWith('set/addItem', { setId: `http://data.europeana.eu/set${setId}`, itemId: identifier });
        });
      });
    });
  });

  describe('reject button', () => {
    it('is visible', () => {
      const wrapper = factory({ recommendationFlag: true });

      const rejectButton = wrapper.find('[data-qa="reject button"]');

      rejectButton.isVisible().should.be.true;
    });

    context('when user is logged in', () => {
      const $auth = { loggedIn: true };

      context('when pressed', () => {
        it('dispatches to reject recommended item', async() => {
          const wrapper = factory({ $auth, recommendationFlag: true });

          const rejectButton = wrapper.find('[data-qa="reject button"]');
          rejectButton.trigger('click');

          storeDispatch.should.have.been.calledWith('set/reviewRecommendation', { setId, itemIds: ['/123/abc'], action: 'reject' });
        });
      });
    });
  });
});
