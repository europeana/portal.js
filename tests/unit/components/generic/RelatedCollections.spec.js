import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import Vuex from 'vuex';
import sinon from 'sinon';

import RelatedCollections from '@/components/generic/RelatedCollections.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

const factory = (options = {}) => {
  return mount(RelatedCollections, {
    localVue,
    propsData: options.propsData,
    stubs: ['b-container'],
    mocks: {
      ...{
        $apis: { thumbnail: { edmPreview: (img, { size }) => `${img}&size=w${size}` } },
        $i18n: { locale: 'en' },
        $t: () => {},
        $fetch: () => {},
        $path: (args) => {
          return `${args.params.type} - ${args.params.pathMatch}`;
        },
        $link: {
          to: route => route,
          href: () => null
        }
      }, ...(options.mocks || {})
    },
    store: options.store || store()
  });
};
const store = (options = {}) => {
  return new Vuex.Store({
    state: options.state || {
      i18n: {
        locale: 'en'
      }
    }
  });
};

const relatedCollections = [
  {
    description: 'This is a scpecially curated chip!',
    identifier: 'http://data.europeana.eu/agent/base/123',
    image: 'imageUrlItem1',
    name: 'Entity from contentful',
    slug: '123-entity-from-contentful'
  },
  {
    id: 'http://data.europeana.eu/concept/base/194',
    prefLabel: {
      en: 'Visual arts'
    },
    isShownBy: {
      id: 'item2isShownById',
      source: 'http://data.europeana.eu/item/123/XYZ',
      thumbnail: 'thumbnailUrlItem2',
      type: 'WebResource'
    }
  },
  {
    id: 'http://data.europeana.eu/organzation/base/1',
    logo: {
      id: 'http://www.wikimedia.org/wiki/Special:FilePath/logoUrlItem3.jpg',
      source: 'www.wikimedia.org/wiki/Special:FilePath/logoUrlItem3'
    },
    prefLabel: {
      en: 'Europeana'
    }
  },
  {
    id: 'http://data.europeana.eu/concept/base/207',
    prefLabel: {
      en: 'Byzantine art'
    }
  }
];

describe('components/generic/RelatedCollections', () => {
  describe('when related collections are found', () => {
    const wrapper = factory();
    wrapper.setProps({ relatedCollections });

    it('shows a section with related collections chips', () => {
      const relatedCollections = wrapper.find('[data-qa="related collections"]');
      expect(relatedCollections.isVisible()).toBe(true);
    });

    it('contains four related chips', () => {
      const chips = wrapper.findAll('a.badge');
      expect(chips.length).toBe(4);
    });
  });

  describe('when no related collections are found', () => {
    const wrapper = factory();
    wrapper.setProps({ relatedCollections: [] });

    it('related collections does not render', () => {
      const relatedCollections = wrapper.find('[data-qa="related collections"]');
      expect(relatedCollections.exists()).toBe(false);
    });
  });

  describe('methods', () => {
    describe('draw', () => {
      it('emits "show" when relatedCollections has members', async() => {
        const wrapper = factory({ propsData: { relatedCollections } });

        await wrapper.vm.draw();

        expect(wrapper.emitted('show').length).toBeGreaterThanOrEqual(1);
        expect(wrapper.emitted('hide')).toBe(undefined);
      });

      it('emits "hide" when relatedCollections is blank', async() => {
        const wrapper = factory({ propsData: { relatedCollections: [] } });

        await wrapper.vm.draw();

        expect(wrapper.emitted('hide').length).toBeGreaterThanOrEqual(1);
        expect(wrapper.emitted('show')).toBe(undefined);
      });

      it('redraws Masonry', async() => {
        const wrapper = factory({ propsData: { relatedCollections } });
        wrapper.vm.$redrawVueMasonry = sinon.spy();

        await wrapper.vm.draw();

        expect(wrapper.vm.$redrawVueMasonry.called).toBe(true);
      });
    });

    describe('linkGen', () => {
      describe('when the item has an identifier/it is a curated chip from contenful', () => {
        it('uses the identifier and name for the slug', () => {
          const wrapper = factory();
          expect(wrapper.vm.linkGen(relatedCollections[0])).toEqual('person - 123-entity-from-contentful');
        });
      });

      describe('when the item has an id/it is a Europeana entity from a search request', () => {
        it('uses the id and the prefLabel for the name', () => {
          const wrapper = factory();
          expect(wrapper.vm.linkGen(relatedCollections[1])).toEqual('topic - 194-visual-arts');
        });
      });
    });

    describe('imageUrl', () => {
      describe('when the item has an image attribute', () => {
        it('uses the image at a width of 200', () => {
          const wrapper = factory();
          expect(wrapper.vm.imageUrl(relatedCollections[0])).toEqual('imageUrlItem1&size=w200');
        });
      });
      describe('when the item has an isShownBy with a thumbnail', () => {
        it('uses the thumbnail at a width of 200', () => {
          const wrapper = factory();
          expect(wrapper.vm.imageUrl(relatedCollections[1])).toEqual('thumbnailUrlItem2&size=w200');
        });
      });
      describe('when the item has a logo attribute', () => {
        it('uses the logo URL from wikimedia at a size of 28', () => {
          const wrapper = factory();
          expect(wrapper.vm.imageUrl(relatedCollections[2])).toEqual('https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/logoUrlItem3.jpg/28px-logoUrlItem3.jpg');
        });
      });
      describe('when there is no relevant attribute', () => {
        it('returns null', () => {
          const wrapper = factory();
          expect(wrapper.vm.imageUrl(relatedCollections[3])).toBeNull();
        });
      });
    });
  });
});
