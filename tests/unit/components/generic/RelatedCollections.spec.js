import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import Vuex from 'vuex';
import sinon from 'sinon';

import RelatedCollections from '@/components/generic/RelatedCollections.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

const $path = sinon.stub();
const factory = (options = {}) => {
  return mount(RelatedCollections, {
    localVue,
    propsData: {
      query: 'Art'
    },
    stubs: ['b-container'],
    mocks: {
      ...{
        $i18n: { locale: 'en' },
        $t: () => {},
        $fetch: () => {},
        $path,
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

const relatedChips = [
  {
    id: 'http://data.europeana.eu/concept/base/190',
    prefLabel: {
      en: 'Art'
    }
  },
  {
    id: 'http://data.europeana.eu/concept/base/194',
    prefLabel: {
      en: 'Visual arts'
    }
  },
  {
    id: 'http://data.europeana.eu/concept/base/96',
    prefLabel: {
      en: 'Art Nouveau'
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
  context('when related collections are found', async() => {
    const wrapper = factory();
    await wrapper.setProps({ relatedCollections: relatedChips });

    it('shows a section with related collections chips', () => {
      const relatedCollections = wrapper.find('[data-qa="related collections"]');
      relatedCollections.isVisible().should.be.true;
    });

    it('contains four related chips', () => {
      const chips = wrapper.findAll('span.badge');
      chips.length.should.eq(4);
    });
  });

  context('when no related collections are found', async() => {
    const wrapper = factory();
    await wrapper.setProps({ relatedCollections: [] });

    it('related collections does not render', () => {
      const relatedCollections = wrapper.find('[data-qa="related collections"]');
      relatedCollections.exists().should.be.false;
    });
  });
});
