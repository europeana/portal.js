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
            communities: ['Research', 'Climate', 'Education'],
            country: 'The Netherlands',
            email: 'test@person@example.org',
            url: 'https://www.linkedin.com/test_person'
          }
        ]
      }
    }
  },
  peopleCountries: {
    data: {
      personCollection: {
        items: [
          {
            country: 'The Netherlands'
          }
        ]
      }
    }
  },
  peopleCommunities: {
    data: {
      personCollection: {
        items: [
          {
            communities: ['Research', 'Climate', 'Education']
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

    contentfulQueryStub.withArgs(
      sinon.match((ast) => ast?.definitions?.[0]?.name?.value === 'PeopleCountries'),
      sinon.match.object
    ).resolves(cloneDeep(fixtures.peopleCountries));

    contentfulQueryStub.withArgs(
      sinon.match((ast) => ast?.definitions?.[0]?.name?.value === 'PeopleCommunities'),
      sinon.match.object
    ).resolves(cloneDeep(fixtures.peopleCommunities));
  });
  afterEach(sinon.resetHistory);
  afterAll(sinon.restore);

  it('renders breadcrumb navigation with a link back to the ENA page', async() => {
    const wrapper = factory();

    expect(wrapper.find('nav .breadcrumb').isVisible()).toBe(true);
    expect(wrapper.findAll('nav .breadcrumb-item').at(0).text()).toEqual('pages.enaMembers.ena');
    expect(wrapper.findAll('nav .breadcrumb-item').at(1).text()).toEqual('pages.enaMembers.directory');
  });

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
        locale: 'en-GB'
      })).toBe(true);
    });

    it('does not re-fetch the static page content on pagination', async() => {
      const wrapper = factory();

      wrapper.vm.pageFetched = true;
      wrapper.vm.$route.query.page = 2;

      await wrapper.vm.fetch();

      expect(contentfulQueryStub.calledWith(sinon.match((ast) => ast?.definitions?.[0]?.name?.value === 'StaticPage'), {
        identifier: 'network/members',
        locale: 'en-GB'
      })).toBe(false);

      expect(contentfulQueryStub.calledWith(sinon.match((ast) => ast?.definitions?.[0]?.name?.value === 'People'), {
        participation: ['Network Association'],
        skip: 20,
        locale: 'en-GB'
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
    it('re-fetches people filtered to country and resets filter options', async() => {
      const country = 'Netherlands';
      const wrapper = factory();

      wrapper.vm.$route.query.country = country;

      await wrapper.vm.fetchPeople();

      expect(contentfulQueryStub.calledWith(sinon.match((ast) => ast?.definitions?.[0]?.name?.value === 'People'), {
        participation: ['Network Association'],
        skip: 0,
        country,
        locale: 'en-GB'
      })).toBe(true);
      expect(wrapper.vm.countries).toEqual([]);
      expect(wrapper.vm.communities).toEqual([]);
      expect(wrapper.vm.countryOptionsFetched).toEqual(false);
      expect(wrapper.vm.communitiesOptionsFetched).toEqual(false);
    });
  });

  describe('when communities query update', () => {
    it('re-fetches people filtered to communities and resets filter options', async() => {
      const communities = ['Education', 'Research'];
      const wrapper = factory();

      wrapper.vm.$route.query.communities = communities.join(',');

      await wrapper.vm.fetchPeople();

      expect(contentfulQueryStub.calledWith(sinon.match((ast) => ast?.definitions?.[0]?.name?.value === 'People'), {
        participation: ['Network Association'],
        skip: 0,
        communities,
        locale: 'en-GB'
      })).toBe(true);
      expect(wrapper.vm.countries).toEqual([]);
      expect(wrapper.vm.communities).toEqual([]);
      expect(wrapper.vm.countryOptionsFetched).toEqual(false);
      expect(wrapper.vm.communitiesOptionsFetched).toEqual(false);
    });
  });

  describe('fetchOptions', () => {
    const communities = '1';
    const country = 'France';
    describe('when name is country', () => {
      it('fetches people country values filtered to current query without country', async() => {
        const wrapper = factory({ mocks: { $route: { query: { communities, country } } } });

        await wrapper.vm.fetchOptions('country');

        expect(contentfulQueryStub.calledWith(sinon.match((ast) => ast?.definitions?.[0]?.name?.value === 'PeopleCountries'), {
          participation: ['Network Association'],
          skip: 0,
          communities: [communities],
          locale: 'en-GB',
          limit: 1000
        })).toBe(true);
        expect(wrapper.vm.countries).toEqual([fixtures.peopleCountries.data.personCollection.items[0].country]);
      });
    });
    describe('when name is communities', () => {
      it('fetches people communities values filtered to current query and sorted', async() => {
        const wrapper = factory({ mocks: { $route: { query: { communities, country } } } });

        await wrapper.vm.fetchOptions('communities');

        expect(contentfulQueryStub.calledWith(sinon.match((ast) => ast?.definitions?.[0]?.name?.value === 'PeopleCommunities'), {
          participation: ['Network Association'],
          skip: 0,
          communities: [communities],
          country,
          locale: 'en-GB',
          limit: 1000
        })).toBe(true);
        expect(wrapper.vm.communities).toEqual(['Climate', 'Education', 'Research']);
      });
    });
  });
});
