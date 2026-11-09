import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';
import sinon from 'sinon';

import networMembersPage from '@/pages/network/members';

const localVue = createLocalVue();

const name = 'Network members';
const description = 'page description';
const image = { url: 'https://www.example.eu/image.webp' };
const fixtures = {
  data: {
    staticPageCollection: {
      items: [
        {
          name,
          description,
          image
        }
      ]
    }
  }
};

const contentfulQueryStub = sinon.stub();

const factory = ({ contentfulResponse = {}, mocks = {} } = {}) => {
  contentfulQueryStub.resolves(contentfulResponse);

  return shallowMountNuxt(networMembersPage, {
    localVue,
    mocks: {
      $contentful: {
        query: contentfulQueryStub
      },
      $i18n: { localeProperties: { iso: 'en-GB' } },
      $route: { query: {} },
      $t: (key) => key,
      ...mocks
    },
    stubs: ['b-container', 'b-row', 'b-col']
  });
};

describe('pages/network/members', () => {
  afterEach(sinon.resetHistory);
  afterAll(sinon.restore);

  describe('fetch', () => {
    it('fetches the content from Contentful', async() => {
      const wrapper = factory({ contentfulResponse: fixtures });

      await wrapper.vm.fetch();

      expect(contentfulQueryStub.calledWith(sinon.match((ast) => ast?.definitions?.[0]?.name?.value === 'StaticPage'), {
        identifier: 'network/members',
        locale: 'en-GB',
        preview: false
      })).toBe(true);
    });

    it('renders a content header with title, description and image for sharing', async() => {
      const wrapper = factory({ contentfulResponse: fixtures });

      await wrapper.vm.fetch();

      const contentHeader = wrapper.find('contentheader-stub');

      expect(contentHeader.isVisible()).toBe(true);
      expect(contentHeader.attributes('title')).toEqual(name);
      expect(contentHeader.attributes('description')).toEqual(description);
      expect(contentHeader.attributes('mediaurl')).toEqual(image.url);
    });

    it('handles potentially not having a page in Contentful', async() => {
      const wrapper = factory({ contentfulResponse: { data: { staticPageCollection: { items: [] } } } });

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
});
