import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';
import cloneDeep from 'lodash/cloneDeep.js';
import sinon from 'sinon';

import networkMembersPage from '@/pages/network/members';

const localVue = createLocalVue();

const name = 'Network members';
const description = 'page description';
const image = { url: 'https://www.example.eu/image.webp' };
const fixtures = {
  staticPage: {
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
  },
  people: {
    data: {
      personCollection: {
        items: [
          {
            name: 'Test Person',
            communities: ['One', 'Two', 'Three'],
            email: 'test@person@example.org',
            url: 'https://www.linkedin.com/test_person'
          }
        ]
      }
    }
  }
};

const contentfulQueryStub = sinon.stub();

const factory = ({ mocks = {} } = {}) => {
  return shallowMountNuxt(networkMembersPage, {
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
  beforeEach(() => {
    contentfulQueryStub.withArgs(
      sinon.match((ast) => ast?.definitions?.[0]?.name?.value === 'StaticPage'),
      sinon.match.object
    ).resolves(cloneDeep(fixtures.staticPage));

    contentfulQueryStub.withArgs(
      sinon.match((ast) => ast?.definitions?.[0]?.name?.value === 'People'),
      sinon.match.object
    ).resolves(cloneDeep(fixtures.people));
  });
  afterEach(sinon.resetHistory);
  afterAll(sinon.restore);

  describe('fetch', () => {
    it('fetches the page and people from Contentful', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(contentfulQueryStub.calledWith(sinon.match((ast) => ast?.definitions?.[0]?.name?.value === 'StaticPage'), {
        identifier: 'network/members',
        locale: 'en-GB',
        preview: false
      })).toBe(true);

      expect(contentfulQueryStub.calledWith(sinon.match((ast) => ast?.definitions?.[0]?.name?.value === 'People'), {
        participation: ['Network Association'],
        skip: 0,
        communities: undefined,
        country: undefined,
        locale: 'en-GB',
        preview: false
      })).toBe(true);
    });

    it('does not re-fetch the static page content on pagination', async() => {
      const wrapper = factory();

      wrapper.vm.pageFetched = true;
      wrapper.vm.$route.query.page = 2;

      await wrapper.vm.fetch();

      expect(contentfulQueryStub.calledWith(sinon.match((ast) => ast?.definitions?.[0]?.name?.value === 'StaticPage'), {
        identifier: 'network/members',
        locale: 'en-GB',
        preview: false
      })).toBe(false);

      expect(contentfulQueryStub.calledWith(sinon.match((ast) => ast?.definitions?.[0]?.name?.value === 'People'), {
        participation: ['Network Association'],
        skip: 20,
        communities: undefined,
        country: undefined,
        locale: 'en-GB',
        preview: false
      })).toBe(true);
    });

    it('renders a content header with title, description and image for sharing', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      const contentHeader = wrapper.find('contentheader-stub');

      expect(contentHeader.isVisible()).toBe(true);
      expect(contentHeader.attributes('title')).toEqual(name);
      expect(contentHeader.attributes('description')).toEqual(description);
      expect(contentHeader.attributes('mediaurl')).toEqual(image.url);
    });

    it('renders a person table', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      const personTable = wrapper.find('persontable-stub');

      expect(personTable.isVisible()).toBe(true);
    });

    it('handles potentially not having a page in Contentful', async() => {
      contentfulQueryStub.withArgs(
        sinon.match((ast) => ast?.definitions?.[0]?.name?.value === 'StaticPage'),
        sinon.match.object
      ).resolves(cloneDeep({ data: { staticPageCollection: { items: [] } } }));

      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(wrapper.vm.name).toEqual(null);
    });

    describe('when fetch errors', () => {
      it('renders an error page', () => {
        const wrapper = factory({ mocks: { $fetchState: { error: { message: 'Error message' } } } });

        const errorContainer = wrapper.find('[data-qa="error message container"]');

        expect(errorContainer.exists()).toBe(true);
      });
    });
  });
  describe('when country query update', () => {
    it('re-fetches people filtered to country', async() => {
      const country = 'Netherlands';
      const wrapper = factory();

      wrapper.vm.$route.query.country = country;

      await wrapper.vm.fetchPeople();

      expect(contentfulQueryStub.calledWith(sinon.match((ast) => ast?.definitions?.[0]?.name?.value === 'People'), {
        participation: ['Network Association'],
        skip: 0,
        communities: undefined,
        country,
        locale: 'en-GB',
        preview: false
      })).toBe(true);
    });
  });

  describe('when communities query update', () => {
    it('re-fetches people filtered to communities', async() => {
      const communities = ['Education', 'Research'];
      const wrapper = factory();

      wrapper.vm.$route.query.communities = communities.join(',');

      await wrapper.vm.fetchPeople();

      expect(contentfulQueryStub.calledWith(sinon.match((ast) => ast?.definitions?.[0]?.name?.value === 'People'), {
        participation: ['Network Association'],
        skip: 0,
        communities,
        country: undefined,
        locale: 'en-GB',
        preview: false
      })).toBe(true);
    });
  });
});
