import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import featureIdeasPage from '@/pages/feature-ideas/index';
import * as useContentfulGraphqlModule from '@/composables/contentful/useContentfulGraphql.js';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const contentfulQueryStub = sinon.stub();

const factory = ({ contentfulResponse = {}, mocks = {} } = {}) => {
  contentfulQueryStub.resolves(contentfulResponse);

  return shallowMountNuxt(featureIdeasPage, {
    localVue,
    mocks: {
      $i18n: { localeProperties: { iso: 'en-GB' } },
      $route: { query: {} },
      $t: (key) => key,
      $tc: (key) => key,
      ...mocks
    },
    stubs: [
      'AlertMessage',
      'ContentRichText',
      'FeatureIdeas'
    ]
  });
};

describe('pages/feature-ideas/index', () => {
  beforeAll(() => {
    sinon.stub(useContentfulGraphqlModule, 'useContentfulGraphql').returns({
      query: contentfulQueryStub
    });
  });
  afterEach(sinon.resetHistory);
  afterAll(sinon.restore);

  describe('fetch', () => {
    it('fetches the content from Contentful', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(contentfulQueryStub.calledWith(sinon.match((ast) => ast?.definitions?.[0]?.name?.value === 'FeatureIdeasPage'), {
        locale: 'en-GB',
        preview: false
      })).toBe(true);
    });

    it('handles potentially not having a page in Contentful', async() => {
      const wrapper = factory({ contentfulResponse: { data: { data: { featureIdeasPageCollection: { items: [] } } } } });

      await wrapper.vm.fetch();

      expect(wrapper.vm.name).toEqual(null);
    });

    describe('when fetch errors', () => {
      it('renders an alert message', () => {
        const wrapper = factory({ mocks: { $fetchState: { error: { message: 'Error message' } } } });

        const alertMessage = wrapper.find('[data-qa="alert message container"]');

        expect(alertMessage.exists()).toBe(true);
      });
    });
  });

  describe('when there are no feature ideas', () => {
    it('does render the feature ideas', async() => {
      const wrapper = factory({ contentfulResponse: { data: { data: { featureIdeasPageCollection: { items: [{
        name: 'Feature Ideas'
      }] } } } } });

      await wrapper.vm.fetch();

      expect(wrapper.find('[data-qa="feature ideas"]').exists()).toBe(true);
    });
  });
});
