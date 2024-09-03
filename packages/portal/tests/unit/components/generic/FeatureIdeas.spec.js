import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import nock from 'nock';
import sinon from 'sinon';

import BootstrapVue from 'bootstrap-vue';
import FeatureIdeas from '@/components/generic/FeatureIdeas.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const features = [
  { identifier: 'feature-1', name: 'Feature 1', text: 'Feature 1 text' },
  { identifier: 'feature-2', name: 'Feature 2', text: 'Feature 2 text' }
];

const config = {
  app: {
    baseUrl: 'https://www.example.org'
  }
};

const factory = ({ propsData = {}, mocks = {} } = {}) => {
  return shallowMountNuxt(FeatureIdeas, {
    localVue,
    propsData,
    mocks: {
      $auth: {
        loggedIn: false
      },
      $config: config,
      $error: sinon.spy(),
      $fetchState: {},
      $nuxt: { context: {} },
      $t: (key) => key,
      $tc: (key) => key,
      ...mocks
    },
    stubs: ['ErrorMessage']
  });
};

describe('components/generic/FeatureIdeas', () => {
  beforeAll(() => nock.disableNetConnect());
  afterAll(() => nock.enableNetConnect());

  describe('fetch', () => {
    describe('when there are no features', () => {
      it('renders a message', async() => {
        const wrapper = factory({ mocks: { $fetchState: { error: { code: 'noFeatureIdeas' } } } });

        await wrapper.vm.fetch();

        const errorMessage = wrapper.find('[data-qa="error message"]');

        expect(wrapper.vm.$error.calledWith(
          sinon.match.has('code', 'noFeatureIdeas')
        )).toBe(true);
        expect(errorMessage.exists()).toBe(true);
      });
    });

    describe('when there are features', () => {
      it('fetches the features votes from the API', async() => {
        const expectedVotesResponse = {
          'feature-1': { total: 12 },
          'feature-2': { total: 21 }
        };

        const wrapper = factory({ propsData: { features } });

        nock(config.app.baseUrl)
          .get('/_api/votes?candidate=feature-1,feature-2')
          .reply(200, expectedVotesResponse);

        await wrapper.vm.fetch();

        expect(nock.isDone()).toBe(true);
        expect(wrapper.vm.votesOnFeatures).toEqual(expectedVotesResponse);
      });
    });
  });

  describe('when there are features', () => {
    it('renders a list of features', async() => {
      const wrapper = factory({ propsData: { features } });

      const featureCards = wrapper.findAll('[data-qa="feature idea card"]');

      expect(featureCards.length).toBe(features.length);
    });
  });

  describe('methods', () => {
    describe('headersForAuthorization', () => {
      describe('when the user is logged in', () => {
        it('returns the authorisation token', async() => {
          const wrapper = factory({ mocks: { $auth: { loggedIn: true, getToken: () => 'authToken' } } });
          expect(wrapper.vm.headersForAuthorization()).toEqual({ authorization: 'authToken' });
        });
      });
      describe('when the user is NOT logged in', () => {
        it('returns an empty object', async() => {
          const wrapper = factory();
          expect(wrapper.vm.headersForAuthorization()).toEqual({});
        });
      });
    });

    describe('voteOnFeature', () => {
      describe('when the user is logged in', () => {
        describe('when the user has not yet voted', () => {
          it('sends a put request the vote endpoint, then re-fetches votes', async() => {
            const wrapper = factory({ propsData: { features }, mocks: { $auth: { loggedIn: true, getToken: () => 'authToken' } } });

            wrapper.vm.axiosInstance = sinon.spy();
            wrapper.vm.$fetch = sinon.spy();

            await wrapper.vm.voteOnFeature('feature-1');
            const expectedPutRequestParams = {
              url: '/_api/votes/feature-1',
              method: 'put',
              headers: { authorization: 'authToken' }
            };

            expect(wrapper.vm.axiosInstance.calledWith(sinon.match(expectedPutRequestParams))).toBe(true);
            expect(wrapper.vm.$fetch.calledOnce).toBe(true);
          });
        });

        describe('when the user already voted', () => {
          it('delete to the vote endpoint', async() => {
            const wrapper = factory({ propsData: { features }, mocks: { $auth: { loggedIn: true, getToken: () => 'authToken' } } });
            wrapper.vm.votesOnFeatures = { 'feature-1': { votedByCurrentVoter: true } };

            wrapper.vm.axiosInstance = sinon.spy();
            wrapper.vm.$fetch = sinon.spy();

            await wrapper.vm.voteOnFeature('feature-1');
            const expectedDeleteRequestParams = {
              url: '/_api/votes/feature-1',
              method: 'delete',
              headers: { authorization: 'authToken' }
            };

            expect(wrapper.vm.axiosInstance.calledWith(sinon.match(expectedDeleteRequestParams))).toBe(true);
            expect(wrapper.vm.$fetch.calledOnce).toBe(true);
          });
        });
      });

      describe('when the user is NOT logged in', () => {
        it('causes a keycloak login to be triggered', async() => {
          const wrapper = factory({ propsData: { features } });

          wrapper.vm.keycloakLogin = sinon.spy();

          await wrapper.vm.voteOnFeature('feature-1');

          expect(wrapper.vm.keycloakLogin.calledOnce).toBe(true);
        });
      });
    });

    describe('voteCountOnFeature', () => {
      it('returns the features total from the retrieved totals', () => {
        const wrapper = factory({ propsData: { features } });

        wrapper.vm.votesOnFeatures = { 'feature-1': { total: 12 } };

        expect(wrapper.vm.voteCountOnFeature('feature-1')).toBe(12);
      });
    });

    describe('hasVotedOnFeature', () => {
      describe('when the user has voted', () => {
        it('returns true', () => {
          const wrapper = factory({ propsData: { features } });

          wrapper.vm.votesOnFeatures = { 'feature-1': { total: 12, votedByCurrentVoter: true } };

          expect(wrapper.vm.hasVotedOnFeature('feature-1')).toBe(true);
        });
      });
      describe('when the user has NOT voted', () => {
        it('returns true', () => {
          const wrapper = factory({ propsData: { features } });

          wrapper.vm.votesOnFeatures = { 'feature-1': { total: 12 } };

          expect(wrapper.vm.hasVotedOnFeature('feature-1')).toBe(false);
        });
      });
    });
  });
});
