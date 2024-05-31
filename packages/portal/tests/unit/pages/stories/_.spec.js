import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import sinon from 'sinon';

import page from '@/pages/stories/_';

const localVue = createLocalVue();

const post = {
  name: 'Once Upon a Time',
  identifier: 'once-upon-a-time',
  datePublished: '2020-12-11T09:00:00.000Z',
  primaryImageOfPage: {
    image: {
      url: 'http://example.org/contentful/asset.jpg',
      description: 'Image description'
    }
  },
  authorCollection: {
    items: []
  }
};

const contentfulQuery = sinon.stub();
const errorPluginSpy = sinon.spy();

const factory = ({ data = {} } = {}) => shallowMountNuxt(page, {
  localVue,
  data() {
    return {
      ...data
    };
  },
  mocks: {
    $config: {
      app: {
        baseUrl: 'https://www.europeana.eu'
      }
    },
    $contentful: {
      query: contentfulQuery
    },
    $error: errorPluginSpy,
    $fetchState: {
      pending: false,
      error: null
    },
    $i18n: {
      localeProperties: {
        iso: 'en-GB'
      }
    },
    $route: {
      fullPath: '/en/stories/once-upon-a-time',
      params: { pathMatch: 'once-upon-a-time' },
      path: '/en/stories/once-upon-a-time',
      query: {}
    }
  }
});

describe('Story page', () => {
  beforeEach(() => {
    contentfulQuery.resolves({
      data: {
        data: {
          storyCollection: {
            items: [post]
          }
        }
      }
    });
  });
  afterEach(sinon.reset);

  describe('fetch', () => {
    it('queries contentful for the story', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(contentfulQuery.calledWith('storyPage',
        { identifier: 'once-upon-a-time', locale: 'en-GB', preview: false }
      )).toBe(true);
    });

    it('stores the post from the response in `post`', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(wrapper.vm.post).toEqual(post);
    });

    describe('when no story is returned from contentful', () => {
      beforeEach(() => {
        contentfulQuery.resolves({
          data: {
            data: {
              storyCollection: {
                items: []
              }
            }
          }
        });
      });

      it('sends a 404 to the error plugin', async() => {
        const wrapper = factory();

        await wrapper.vm.fetch();

        expect(errorPluginSpy.calledWith(404, { scope: 'page' })).toBe(true);
      });
    });
  });

  describe('pageMeta()', () => {
    it('uses hero image for og:image', () => {
      const wrapper = factory({ data: { post } });

      const pageMeta = wrapper.vm.pageMeta;

      expect(pageMeta.ogImage).toBe(post.primaryImageOfPage.image.url);
    });
  });
});
