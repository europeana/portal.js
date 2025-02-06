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
  mocks = {},
  data = {},
  contentfulQueryResponse = { data: { data: {} } }
} = {}) => shallowMountNuxt(page, {
  localVue,
  data() {
    return { ...data };
  },
  mocks: {
    $contentful: {
      query: sinon.stub().resolves(contentfulQueryResponse)
    },
    $error: sinon.spy(),
    $features: {},
    $fetchState: {},
    $i18n: { localeProperties: { iso: 'en-GB' } },
    $route: { params: { pathMatch: 'about' }, query: {} },
    $t: key => key,
    ...mocks
  }
});

describe('IndexPage', () => {
  afterEach(sinon.resetHistory);

  it('uses default layout', () => {
    const $route = { params: { pathMatch: 'about' } };
    const wrapper = factory({ mocks: { $route } });

    const layout = wrapper.vm.layout({ route: $route });

    expect(layout).toBe('default');
  });

  describe('fetch', () => {
    describe('home page', () => {
      const $route = { params: {}, query: {} };
      it('does not fetch from Contentful', async() => {
        const wrapper = factory({ mocks: { $route } });

        await wrapper.vm.fetch();

        expect(wrapper.vm.$contentful.query.called).toBe(false);
      });

      describe('when landing page configured to act as home page', () => {
        const slug = 'share-your-collections';
        const $config = { app: { homeLandingPageSlug: slug } };

        it('fetches the content from Contentful', async() => {
          const wrapper = factory({
            mocks: { $config, $route }
          });

          await wrapper.vm.fetch();

          expect(wrapper.vm.$contentful.query.calledWith('landingPage', {
            identifier: slug,
            locale: 'en-GB',
            preview: false
          })).toBe(true);
        });
      });
    });

    describe('landing pages', () => {
      const slug = 'share-your-collections';
      const page = { name: 'Share your collections' };
      const contentfulQueryResponse = { data: { data: { landingPageCollection: { items: [page] } } } };
      const $route = { params: { pathMatch: slug }, query: {} };

      it('fetches the content from Contentful', async() => {
        const wrapper = factory({
          contentfulQueryResponse,
          mocks: { $route }
        });

        await wrapper.vm.fetch();

        expect(wrapper.vm.$contentful.query.calledWith('landingPage', {
          identifier: slug,
          locale: 'en-GB',
          preview: false
        })).toBe(true);
      });

      it('detects and stores landing page content', async() => {
        const wrapper = factory({
          contentfulQueryResponse,
          mocks: { $route }
        });

        await wrapper.vm.fetch();

        expect(wrapper.vm.landingPage).toBe(true);
        expect(wrapper.vm.staticPage).toBe(false);
        expect(wrapper.vm.browsePage).toBe(false);
        expect(wrapper.vm.page).toEqual(page);
      });
    });

    describe('browse and static pages', () => {
      it('fetches the content from Contentful', async() => {
        const slug = 'about-us';
        const wrapper = factory({
          contentfulQueryResponse: { data: { data: { staticPageCollection: { items: [{}] } } } },
          mocks: { $route: { params: { pathMatch: slug }, query: {} } }
        });

        await wrapper.vm.fetch();

        expect(wrapper.vm.$contentful.query.calledWith('browseStaticPage', {
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
          mocks: { $route: { params: { pathMatch: slug }, query: {} } }
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
          mocks: { $route: { params: { pathMatch: slug }, query: {} } }
        });

        await wrapper.vm.fetch();

        expect(wrapper.vm.browsePage).toBe(true);
        expect(wrapper.vm.staticPage).toBe(false);
        expect(wrapper.vm.page).toEqual(page);
      });
    });

    it('detects no static, landing or browse page and throws 404', async() => {
      process.server = true;
      const slug = 'not-found';
      const wrapper = factory({
        contentfulQueryResponse: { data: { data: { browsePageCollection: { items: [] }, staticPageCollection: { items: [] }, landingPageCollection: { items: [] } } } },
        mocks: { $route: { params: { pathMatch: slug }, query: {} } }
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

    it('uses the social media image for og:image', async() => {
      const image = {
        url: socialMediaImageUrl,
        contentType: 'image/jpeg',
        description: 'Social media image description'
      };
      const contentfulQueryResponse = {
        data: {
          data: {
            staticPageCollection: {
              items: [
                {
                  image
                }
              ]
            }
          }
        }
      };
      const wrapper = factory({ contentfulQueryResponse });
      await wrapper.vm.fetch();

      const pageMeta = wrapper.vm.pageMeta;

      expect(pageMeta.ogImage).toBe(image);
    });

    describe('when no social media image but a primary image of page', () => {
      const image = {
        url: primaryImageUrl,
        contentType: 'image/jpeg'
      };
      const contentfulQueryResponse = {
        data: {
          data: {
            staticPageCollection: {
              items: [
                {
                  primaryImageOfPage: {
                    image
                  }
                }
              ]
            }
          }
        }
      };
      it('uses the primary image of page for og:image', async() => {
        const wrapper = factory({ contentfulQueryResponse });
        await wrapper.vm.fetch();

        const pageMeta = wrapper.vm.pageMeta;

        expect(pageMeta.ogImage).toBe(image);
      });
    });

    it('does not set og:image info when no relevant image exist', () => {
      const wrapper = factory({ data });

      const pageMeta = wrapper.vm.pageMeta;

      expect(pageMeta.ogImage).toBeNull();
    });
  });

  describe('when route is for DS4CH page', () => {
    const $route = { params: { pathMatch: 'dataspace-culturalheritage' }, query: {} };

    it('uses ds4ch layout', () => {
      const wrapper = factory({ mocks: { $route } });

      const layout = wrapper.vm.layout({ route: $route });

      expect(layout).toBe('ds4ch');
    });

    it('sets pageMetaSuffixTitle to null', async() => {
      const wrapper = factory({ mocks: { $route } });
      await wrapper.vm.fetch();

      const pageMetaSuffixTitle = wrapper.vm.pageMetaSuffixTitle;

      expect(pageMetaSuffixTitle).toBeNull();
    });
  });
});
