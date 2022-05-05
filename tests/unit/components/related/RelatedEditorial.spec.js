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
  }
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
});
