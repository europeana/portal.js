import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import featureIdeasPage from '@/pages/feature-ideas/index';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const contentfulFullResponse = { data: { data: { featureIdeasPageCollection: { items: [{
  name: 'Feature Ideas',
  description: 'example description',
  socialMediaImage: { image: { url: 'example.com' }, description: 'example description' },
  text: 'example text',
  hasPartCollection: { items: [
    { name: 'Feature 1', text: 'Feature 1 text', image: { image: { url: 'example.com' } } },
    { name: 'Feature 2', text: 'Feature 2 text', image: { image: { url: 'example.com' } } }
  ] }
}] } } } };

const factory = ({ contentfulResponse = {}, $fetchState = {} }) => shallowMountNuxt(featureIdeasPage, {
  localVue,
  mocks: {
    $contentful: {
      query: sinon.stub().resolves(contentfulResponse)
    },
    $fetchState,
    $i18n: { localeProperties: { iso: 'en-GB' } },
    $route: { query: {} },
    $t: key => key
  }
});

describe('pages/feature-ideas/index', () => {
  describe('fetch', () => {
    it('fetches the content from Contentful', async() => {
      const wrapper = factory({ contentfulResponse: contentfulFullResponse });

      await wrapper.vm.fetch();

      expect(wrapper.vm.$contentful.query.calledWith('featureIdeasPage', {
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
        const wrapper = factory({ $fetchState: { error: { message: 'Error message' } } });

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
