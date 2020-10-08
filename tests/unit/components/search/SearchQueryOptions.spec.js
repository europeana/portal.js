import SearchQueryOptions from '../../../../components/search/SearchQueryOptions.vue';

import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(VueRouter);
localVue.use(VueI18n);

const parentInputComponent = {
  name: 'parentInputComponent',
  components: {
    SearchQueryOptions
  },
  props: ['value'],
  template: '<div><input id="searchbox" ref="searchbox" type="text" /><SearchQueryOptions v-model="value" /></div>'
};

const factory = (options = {}) => {
  return mount(parentInputComponent, {
    localVue,
    i18n: options.i18n || new VueI18n,
    attachToDocument: true,
    propsData: options.propsData,
    mocks: {
      ...{
        $t: () => {},
        $path: (opts) => {
          return router.resolve(opts).route.fullPath;
        }
      }, ...(options.mocks || {})
    }
  });
};

describe('components/search/SearchQueryOptions', () => {
  it('shows a link for each option', () => {
    const wrapper = factory({
      propsData: {
        value: [
          { link: { path: '/en/search', query: { query: 'me' } }, qa: 'search link 1' },
          { link: { path: '/en/search', query: { query: '"Medicine"' } }, qa: 'search link 2' }
        ]
      }
    });

    const link1 = wrapper.find('[data-qa="search link 1"]');
    link1.isVisible().should.be.true;
    link1.attributes('href').should.eq('/en/search?query=me');

    const link2 = wrapper.find('[data-qa="search link 2"]');
    link2.isVisible().should.be.true;
    link2.attributes('href').should.eq('/en/search?query=%22Medicine%22');
  });

  describe('options with i18n', () => {
    const i18n = new VueI18n({
      locale: 'en',
      messages: {
        en: {
          searchFor: 'Search for {query}'
        }
      }
    });

    const wrapper = factory({
      i18n,
      propsData: {
        value: [
          {
            link: { path: '/en/search', query: { query: 'map' } },
            qa: 'highlighted query',
            i18n: {
              path: 'searchFor', slots: [
                { name: 'query', value: { text: 'map', highlight: true } }
              ]
            }
          },
          {
            link: { path: '/en/search', query: { query: 'map' } },
            qa: 'unhighlighted query',
            i18n: {
              path: 'searchFor', slots: [
                { name: 'query', value: { text: 'map' } }
              ]
            }
          }
        ]
      }
    });

    it('localises with named slots', () => {
      const link = wrapper.find('[data-qa="highlighted query"]');

      link.text().should.eq('Search for map');
    });

    it('optionally highlights interpolated text', () => {
      const highlighted = wrapper.find('[data-qa="highlighted query"] strong');
      highlighted.text().should.eq('map');

      const unhighlighted = wrapper.find('[data-qa="unhighlighted query"] strong');
      unhighlighted.exists().should.be.false;
    });
  });

  describe('options with texts', () => {
    const wrapper = factory({
      propsData: {
        value: [
          {
            link: { path: '/en/search', query: { query: '"Charles Dickens"' } },
            qa: 'texts link',
            texts: [
              { text: 'Charles ', highlight: false },
              { text: 'D', highlight: true },
              { text: 'ickens ', highlight: false }
            ]
          }
        ]
      }
    });

    it('outputs all texts in the link', () => {
      const link = wrapper.find('[data-qa="texts link"]');

      link.text().should.eq('Charles Dickens');
    });

    it('optionally highlights text', () => {
      const highlighted = wrapper.find('[data-qa="texts link"] strong');

      highlighted.text().should.eq('D');
    });
  });

  it('is navigable by keyboard on the parent input', () => {
    const wrapper = factory({
      propsData: {
        value: [
          { link: { path: '/en/search', query: { query: 'me' } }, qa: 'search link 1' },
          { link: { path: '/en/search', query: { query: '"Medicine"' } }, qa: 'search link 2' }
        ]
      }
    });
    const searchInput = wrapper.find('#searchbox');
    const queryOptionsWrapper = wrapper.find('[data-qa="search query options"]');

    searchInput.trigger('keydown.down');
    queryOptionsWrapper.vm.focus.should.eq(0);
    searchInput.trigger('keydown.down');
    queryOptionsWrapper.vm.focus.should.eq(1);
    searchInput.trigger('keydown.up');
    queryOptionsWrapper.vm.focus.should.eq(0);
  });
});
