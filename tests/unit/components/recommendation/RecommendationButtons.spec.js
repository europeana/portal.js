import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import RecommendationButtons from '@/components/recommendation/RecommendationButtons';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const identifier = '/123/abc';
const setId = '/123/def';
const storeDispatch = sinon.spy();

const factory = ({ storeState = {}, $auth = {}, propsData = {} } = {}) => mount(RecommendationButtons, {
  localVue,
  propsData: { identifier, ...propsData },
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
    it('is present and visible if enabled', () => {
      const wrapper = factory({
        propsData: { enableAcceptButton: true },
        storeState: { active: { type: 'EntityBestItemsSet' } }
      });

      const acceptButton = wrapper.find('[data-qa="accept button"]');

      acceptButton.exists().should.be.true;
      acceptButton.isVisible().should.be.true;
    });

    it('is not present if disabled', () => {
      const wrapper = factory({
        propsData: { enableAcceptButton: false },
        storeState: { active: { type: 'EntityBestItemsSet' } }
      });

      const acceptButton = wrapper.find('[data-qa="accept button"]');

      acceptButton.exists().should.be.false;
    });

    context('when user is logged in', () => {
      const $auth = { loggedIn: true };

      context('when pressed', () => {
        it('dispatches to accept recommended item', async() => {
          const wrapper = factory({ $auth });

          const acceptButton = wrapper.find('[data-qa="accept button"]');
          acceptButton.trigger('click');

          storeDispatch.should.have.been.calledWith('set/reviewRecommendation', { setId, itemIds: ['/123/abc'], action: 'accept' });
          storeDispatch.should.have.been.calledWith('set/addItem', { setId: `http://data.europeana.eu/set${setId}`, itemId: identifier });
        });
      });
    });
  });

  describe('reject button', () => {
    it('is present and visible if enabled', () => {
      const wrapper = factory({
        propsData: { enableRejectButton: true },
        storeState: { active: { type: 'EntityBestItemsSet' } }
      });

      const rejectButton = wrapper.find('[data-qa="reject button"]');

      rejectButton.exists().should.be.true;
      rejectButton.isVisible().should.be.true;
    });

    it('is not present if disabled', () => {
      const wrapper = factory({
        propsData: { enableRejectButton: false },
        storeState: { active: { type: 'EntityBestItemsSet' } }
      });

      const rejectButton = wrapper.find('[data-qa="reject button"]');

      rejectButton.exists().should.be.false;
    });

    context('when user is logged in', () => {
      const $auth = { loggedIn: true };

      context('when pressed', () => {
        it('dispatches to reject recommended item', async() => {
          const wrapper = factory({ $auth });

          const rejectButton = wrapper.find('[data-qa="reject button"]');
          rejectButton.trigger('click');

          storeDispatch.should.have.been.calledWith('set/reviewRecommendation', { setId, itemIds: ['/123/abc'], action: 'reject' });
        });
      });
    });
  });
});
