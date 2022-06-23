import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import BootstrapVue from 'bootstrap-vue';

import page from '@/pages/collections/persons';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMountNuxt(page, {
  localVue,
  data() {
    return {
      page: 1,
      perPage: 24,
      entities: [
        {
          id: 'http://data.europeana.eu/agent/base/123',
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
      total: 17042,
      title: 'Persons'
    };
  },
  mocks: {
    $t: key => key,
    $route: { query: null, params: { type: 'person' } },
    $auth: {
      loggedIn: false
    },
    $apis: {
      entity: {
        search: () => {},
        imageUrl: (image) => image.thumbnail
      }
    }
  }
});

describe('Person listing page', () => {
  describe('pagination', () => {
    it('has a pagination nav', () => {
      const wrapper = factory();

      const pagination = wrapper.find('paginationnavinput-stub');
      expect(pagination.exists()).toBe(true);
    });
  });
});
