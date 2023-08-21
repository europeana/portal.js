import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import page from '@/pages/index';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const socialMediaImageUrl = 'https://example.org/social-media-image.jpg';
const primaryImageUrl = 'https://example.org/primary-image.jpg';

const factory = ({
  $route = { params: {} }, data = {}, contentfulQueryResponse = { data: { data: {} } }
} = {}) => shallowMountNuxt(page, {
  localVue,
  data() {
    return data;
  },
  mocks: {
    $contentful: {
      assets: {
        optimisedSrc: (img) => `${img?.url}?optimised`
      },
      query: sinon.stub().resolves(contentfulQueryResponse)
    },
    $features: {},
    $fetchState: {},
    $i18n: { isoLocale: () => 'en-GB' },
    $error: sinon.spy(),
    $route,
    $t: key => key
  }
});

describe('IndexPage', () => {
  describe('fetch', () => {
    it('fetches the content from Contentful', async() => {
      const slug = 'about-us';
      const wrapper = factory({
        contentfulQueryResponse: { data: { data: { staticPageCollection: { items: [{}] } } } },
        $route: { params: { pathMatch: slug }, query: {} }
      });

      await wrapper.vm.fetch();

      expect(wrapper.vm.$contentful.query.calledWith('browseLandingStaticPage', {
        identifier: slug,
        locale: 'en-GB',
        preview: false
      })).toBe(true);
    });

    it('detects and stores static page content', async() => {
      const page = { name: 'About us' };
      const slug = 'about-us';
      const wrapper = factory({
        contentfulQueryResponse: { data: { data: { staticPageCollection: { items: [page] } } } },
        $route: { params: { pathMatch: slug }, query: {} }
      });

      await wrapper.vm.fetch();

      expect(wrapper.vm.staticPage).toBe(true);
      expect(wrapper.vm.browsePage).toBe(false);
      expect(wrapper.vm.page).toEqual(page);
    });

    it('detects and stores browse page content', async() => {
      const page = { name: 'Collections' };
      const slug = 'collections';
      const wrapper = factory({
        contentfulQueryResponse: { data: { data: { browsePageCollection: { items: [page] } } } },
        $route: { params: { pathMatch: slug }, query: {} }
      });

      await wrapper.vm.fetch();

      expect(wrapper.vm.browsePage).toBe(true);
      expect(wrapper.vm.staticPage).toBe(false);
      expect(wrapper.vm.page).toEqual(page);
    });

    it('detects and stores landing page content', async() => {
      const page = { name: 'Share your data' };
      const slug = 'share-your-data';
      const wrapper = factory({
        contentfulQueryResponse: { data: { data: { landingPageCollection: { items: [page] } } } },
        $route: { params: { pathMatch: slug }, query: {} }
      });

      await wrapper.vm.fetch();

      expect(wrapper.vm.landingPage).toBe(true);
      expect(wrapper.vm.staticPage).toBe(false);
      expect(wrapper.vm.page).toEqual(page);
    });

    it('detects no static, landing or browse page and throws 404', async() => {
      process.server = true;
      const slug = 'not-found';
      const wrapper = factory({
        contentfulQueryResponse: { data: { data: { browsePageCollection: { items: [] }, staticPageCollection: { items: [] }, landingPageCollection: { items: [] } } } },
        $route: { params: { pathMatch: slug }, query: {} }
      });

      await wrapper.vm.fetch();

      expect(wrapper.vm.browsePage).toBe(false);
      expect(wrapper.vm.staticPage).toBe(false);
      expect(wrapper.vm.landingPage).toBe(false);
      expect(wrapper.vm.$error.calledWith(404)).toBe(true);
    });
  });

  describe('pageMeta', () => {
    const data = {
      browsePage: true,
      page: {
        identifer: 'home',
        name: 'Welcome to Europeana',
        hasPartCollection: {
          items: []
        }
      }
    };

    it('uses the social media image for og:image', () => {
      const wrapper = factory({
        data: {
          ...data,
          page: {
            ...data.page,
            image: {
              url: socialMediaImageUrl,
              contentType: 'image/jpeg',
              description: 'Social media image description'
            }
          }
        }
      });

      const pageMeta = wrapper.vm.pageMeta;

      expect(pageMeta.ogImage).toBe(`${socialMediaImageUrl}?optimised`);
    });

    describe('when no social media image but a primary image of page', () => {
      it('uses the primary image of pagefor og:image', () => {
        const wrapper = factory({
          data: {
            ...data,
            page: {
              ...data.page,
              image: null,
              primaryImageOfPage: {
                image: {
                  url: primaryImageUrl,
                  contentType: 'image/jpeg'
                }
              }
            }
          }
        });

        const pageMeta = wrapper.vm.pageMeta;

        expect(pageMeta.ogImage).toBe(`${primaryImageUrl}?optimised`);
      });
    });

    it('does not set og:image info when no relevant image exist', () => {
      const wrapper = factory({ data });

      const pageMeta = wrapper.vm.pageMeta;

      expect(pageMeta.ogImage).toBeNull();
    });
  });
});
