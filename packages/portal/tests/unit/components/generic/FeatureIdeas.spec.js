import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import nock from 'nock';
import sinon from 'sinon';

import BootstrapVue from 'bootstrap-vue';
import FeatureIdeas from '@/components/generic/FeatureIdeas.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ propsData = {}, mocks = {} } = {}) => {
  return shallowMountNuxt(FeatureIdeas, {
    localVue,
    propsData,
    mocks: {
      $auth: {
        loggedIn: false
      },
      $config: {
        app: {
          baseUrl: 'https://www.example.org'
        }
      },
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

    // describe('when there are features', () => {
    //   it('fetches the features votes from the API', async() => {
    //   });
    // });
  });

  describe('when there are features', () => {
    it('renders a list of features', async() => {
      const features = [
        { name: 'Feature 1', text: 'Feature 1 text' },
        { name: 'Feature 2', text: 'Feature 2 text' }
      ];
      const wrapper = factory({ propsData: { features } });

      const featureCards = wrapper.findAll('[data-qa="feature idea card"]');

      expect(featureCards.length).toBe(features.length);
    });
  });
});
