import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import sinon from 'sinon';

import RelatedEditorial from '@/components/related/RelatedEditorial.vue';

const localVue = createLocalVue();

const factory = ({ propsData, mocks } = {})  => shallowMountNuxt(RelatedEditorial, {
  localVue,
  propsData,
  mocks: {
    $contentful: {
      query: sinon.stub().resolves({
        data: {
          data: {
            blogPostingCollection: {
              items: []
            },
            exhibitionPageCollection: {
              items: []
            }
          }
        }
      })
    },
    $i18n: {
      isoLocale: () => 'en-GB'
    },
    $route: {
      query: {}
    },
    $t: (key) => key,
    ...mocks
  },
  stubs: ['b-card-group']
});

describe('components/related/RelatedEditorial', () => {
  afterEach(sinon.resetHistory);

  describe('fetch', () => {
    describe('when an entity URI is supplied', () => {
      const entityUri = 'http://data.europeana.eu/concept/base/123';

      it('queries Contentful for content related to the entity', async() => {
        const wrapper = factory({ propsData: { entityUri } });

        await wrapper.vm.fetch();

        expect(wrapper.vm.$contentful.query.calledWith('entityRelatedContent', {
          entityUri,
          locale: 'en-GB',
          preview: false,
          limit: 4
        })).toBe(true);
      });

      it('stores 4 most recent entries', async() => {
        const primaryImageOfPage = { image: {} };
        const contentfulQueryResponse = {
          data: {
            data: {
              blogPostingCollection: {
                items: [
                  { identifier: 'blog-1', datePublished: '2022-04-30T00:00:00.000+00:00', primaryImageOfPage },
                  { identifier: 'blog-2', datePublished: '2022-04-20T00:00:00.000+00:00', primaryImageOfPage },
                  { identifier: 'blog-3', datePublished: '2022-04-10T00:00:00.000+00:00', primaryImageOfPage }
                ]
              },
              exhibitionPageCollection: {
                items: [
                  { identifier: 'exhibition-1', datePublished: '2022-04-25T00:00:00.000+00:00', primaryImageOfPage },
                  { identifier: 'exhibition-2', datePublished: '2022-04-24T00:00:00.000+00:00', primaryImageOfPage },
                  { identifier: 'exhibition-3', datePublished: '2022-04-05T00:00:00.000+00:00', primaryImageOfPage }
                ]
              }
            }
          }
        };

        const wrapper = factory({ propsData: { entityUri } });
        wrapper.vm.$contentful.query.resolves(contentfulQueryResponse);

        await wrapper.vm.fetch();

        expect(wrapper.vm.related.map(entry => entry.identifier)).toEqual([
          'blog-1', 'exhibition-1', 'exhibition-2', 'blog-2'
        ]);
      });
    });

    describe('when no entity URI is supplied', () => {
      const entityUri = null;

      it('does not query Contentful', async() => {
        const wrapper = factory({ propsData: { entityUri } });

        await wrapper.vm.fetch();

        expect(wrapper.vm.$contentful.query.called).toBe(false);
      });
    });
  });

  describe('methods', () => {
    describe('entryUrl', () => {
      it('prefixes BlogPosting entries with /blog', () => {
        const wrapper = factory();

        const entryUrl = wrapper.vm.entryUrl({
          '__typename': 'BlogPosting',
          identifier: 'interesting'
        });

        expect(entryUrl).toBe('/blog/interesting');
      });

      it('prefixes ExhibitionPage entries with /exhibitions', () => {
        const wrapper = factory();

        const entryUrl = wrapper.vm.entryUrl({
          '__typename': 'ExhibitionPage',
          identifier: 'educational'
        });

        expect(entryUrl).toBe('/exhibitions/educational');
      });
    });
  });
});
