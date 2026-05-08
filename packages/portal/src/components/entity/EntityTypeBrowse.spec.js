import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';
import sinon from 'sinon';

import EntityTypeBrowse from './EntityTypeBrowse.vue';

const localVue = createLocalVue();

const factory = ({ propsData = {} } = {}) => shallowMountNuxt(EntityTypeBrowse, {
  localVue,
  data() {
    return {
      entities: [
        {
          id: 'http://data.europeana.eu/agent/123',
          isShownBy: {
            id: 'http://mm.dimu.no/image/012wWWWtptov?dimension=800x800',
            thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Fmm.dimu.no%2Fimage%2F012wWWWtptov%3Fdimension%3D800x800&type=IMAGE',
            type: 'WebResource'
          },
          prefLabel: {
            en: 'person name'
          },
          type: 'Agent'
        }
      ],
      total: 17042
    };
  },
  propsData: {
    type: 'persons',
    ...propsData
  },
  mocks: {
    $t: key => key,
    $route: { query: {} },
    $apis: {
      entity: {
        search: sinon.stub().resolves({})
      }
    },
    $i18n: {
      locale: 'es'
    }
  },
  stubs: ['b-col', 'b-row']
});

describe('components/entity/EntityTypeBrowse', () => {
  describe('template', () => {
    it('has a pagination nav', () => {
      const wrapper = factory();

      const pagination = wrapper.find('paginationnavinput-stub');
      expect(pagination.exists()).toBe(true);
    });
  });

  describe('fetch', () => {
    it('requests entities from the Entity API', async() => {
      const wrapper = factory();

      await wrapper.vm.$fetch();

      expect(wrapper.vm.$apis.entity.search.calledWith({
        query: '*:*',
        page: 1,
        type: 'agent',
        pageSize: 24,
        scope: 'europeana',
        sort: 'skos_prefLabel.es',
        qf: 'skos_prefLabel.es:*',
        fl: 'skos_prefLabel.*,isShownBy,isShownBy.thumbnail'
      })).toBe(true);
    });

    it('scrolls to the page header element', async() => {
      const wrapper = factory();
      process.client = true;
      wrapper.vm.scrollToSelector = sinon.spy();

      await wrapper.vm.fetch();

      expect(wrapper.vm.scrollToSelector.calledWith('#header')).toBe(true);
    });
  });
});

