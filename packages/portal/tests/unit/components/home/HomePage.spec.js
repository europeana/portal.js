import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import sinon from 'sinon';

import HomePage from '@/components/home/HomePage';

const localVue = createLocalVue();

const image = {
  url: 'https://images.ctfassets.net/image.jpeg',
  contentType: 'image/jpeg'
};

const homePageContentfulResponse = {
  data: {
    homePageCollection: {
      items: [
        {
          sectionsCollection: {
            items: [
              { '__typename': 'SomethingElse' },
              { '__typename': 'PrimaryCallToAction', name: 'Primary', relatedLink: {}, text: '' },
              { '__typename': 'PrimaryCallToAction', name: 'Seconday', relatedLink: {}, text: '' }
            ]
          },
          image,
          primaryImageSetOfPageCollection: {
            items: [
              {
                hasPartCollection: {
                  items: [
                    image
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  }
};
const contentfulQueryStub = sinon.stub();
contentfulQueryStub.resolves(homePageContentfulResponse);

const factory = ({ data = {} } = {}) => shallowMountNuxt(HomePage, {
  localVue,
  data() {
    return data;
  },
  mocks: {
    $contentful: {
      query: contentfulQueryStub
    },
    $i18n: {
      locale: 'en',
      localeProperties: { iso: 'en-GB' }
    },
    $route: { query: {} },
    $t: (key) => key,
    localePath: (args) => {
      return args.params ? `${args.params.type}/${args.params.pathMatch}` : args;
    }
  },
  stubs: ['b-container']
});

describe('components/home/HomePage', () => {
  afterEach(sinon.resetHistory);
  afterAll(sinon.restore);

  describe('fetch', () => {
    it('sets `backgroundImage` from the available options', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(wrapper.vm.backgroundImage).toBe(image);
    });

    it('sets `callsToAction` from the ContentPrimaryCallToAction-type sections', async() => {
      const wrapper = factory();
      await wrapper.vm.fetch();

      expect(wrapper.vm.callsToAction).toEqual([
        { '__typename': 'PrimaryCallToAction', name: 'Primary', relatedLink: {}, text: '' },
        { '__typename': 'PrimaryCallToAction', name: 'Seconday', relatedLink: {}, text: '' }
      ]);
    });
  });

  describe('computed', () => {
    describe('pageMeta', () => {
      it('uses localised page title for title field', () => {
        const wrapper = factory();

        const pageMeta = wrapper.vm.pageMeta;

        expect(pageMeta.title).toBe('homePage.title');
      });

      it('uses localised page sub-headline for description field', () => {
        const wrapper = factory();

        const pageMeta = wrapper.vm.pageMeta;

        expect(pageMeta.description).toBe('homePage.subHeadline');
      });

      describe('og:image', () => {
        it('uses CTF social media image', async() => {
          const wrapper = factory();
          await wrapper.vm.fetch();

          const pageMeta = wrapper.vm.pageMeta;

          expect(pageMeta.ogImage).toBe(image);
        });
      });
    });
  });
});
