import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import HomePage from '@/pages/home/index';
import sinon from 'sinon';

const localVue = createLocalVue();

const imageWithAttribution = {
  url: 'https://images.ctfassets.net/image.jpeg',
  contentType: 'image/jpeg'
};

const homePageContentfulResponse = {
  data: {
    data: {
      homePageCollection: {
        items: [
          {
            sectionsCollection: {
              items: []
            },
            primaryImageSetOfPageCollection: {
              items: [
                {
                  hasPartCollection: {
                    items: [
                      imageWithAttribution
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  }
};

const factory = ({ data = {} } = {}) => shallowMountNuxt(HomePage, {
  localVue,
  data() {
    return data;
  },
  mocks: {
    $contentful: {
      assets: {
        optimisedSrc: sinon.spy((img) => `${img?.url}?optimised`)
      },
      query: sinon.stub().resolves(homePageContentfulResponse)
    },
    $i18n: {
      locale: 'en',
      isoLocale: () => 'en-GB'
    },
    $route: { query: {} },
    $t: (key) => key,
    localePath: (args) => {
      return args.params ? `${args.params.type}/${args.params.pathMatch}` : args;
    },
    $fetchState: {}
  },
  stubs: ['IndexPage']
});

describe('pages/home/index', () => {
  afterEach(sinon.resetHistory);

  describe('fetch', () => {
    it('fetches the homePage entry from Contentful', async() => {
      const wrapper = factory();
      const clock = sinon.useFakeTimers();

      await wrapper.vm.fetch();

      expect(wrapper.vm.$contentful.query.calledWith('homePage', {
        locale: 'en-GB',
        preview: false,
        identifier: null,
        date: '1970-01-01T00:00:00.000Z'
      })).toBe(true);

      clock.restore();
    });

    it('sets the backgroundImage from the available options', async() => {
      const wrapper = factory();
      const clock = sinon.useFakeTimers();

      await wrapper.vm.fetch();

      expect(wrapper.vm.backgroundImage).toBe(imageWithAttribution);

      clock.restore();
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
        const expected = 'https://images.ctfassets.net/image.jpeg?optimised';

        it('favours CTF social media image', async() => {
          const wrapper = factory();
          await wrapper.setData({ socialMediaImage: imageWithAttribution });
          await wrapper.vm.$nextTick();

          const pageMeta = wrapper.vm.pageMeta;

          expect(pageMeta.ogImage).toBe(expected);
        });

        it('falls back to CTF background image', async() => {
          const wrapper = factory();
          await wrapper.setData({ backgroundImage: { image: imageWithAttribution } });
          await wrapper.vm.$nextTick();

          const pageMeta = wrapper.vm.pageMeta;

          expect(pageMeta.ogImage).toBe(expected);
        });
      });
    });

    describe('callsToAction', () => {
      it('returns the ContentPrimaryCallToAction-type sections', () => {
        const data = {
          sections: [
            { '__typename': 'SomethingElse' },
            { '__typename': 'PrimaryCallToAction', name: 'Primary', relatedLink: {}, text: '' },
            { '__typename': 'PrimaryCallToAction', name: 'Seconday', relatedLink: {}, text: '' }
          ]
        };
        const wrapper = factory({ data });

        const ctas = wrapper.vm.callsToAction;

        expect(ctas).toEqual([
          { '__typename': 'PrimaryCallToAction', name: 'Primary', relatedLink: {}, text: '' },
          { '__typename': 'PrimaryCallToAction', name: 'Seconday', relatedLink: {}, text: '' }
        ]);
      });
    });
  });
});
