import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SearchQueryOptions from '../../../../components/search/SearchQueryOptions.vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
// import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(VueRouter);
localVue.use(Vuex);

const parentInputComponent = {
  name: 'parentInputComponent',
  components: {
    SearchQueryOptions
  },
  template: '<div><input id="searchbox" ref="searchbox" type="text" /><SearchQueryOptions /></div>'
};

const factory = (options = {}) => {
  return mount(parentInputComponent, {
    localVue,
    attachToDocument: true,
    mocks: {
      ...{
        $t: () => {},
        $path: (opts) => {
          return router.resolve(opts).route.fullPath;
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

const query = 'dor';
const suggestions = {
  'http://data.europeana.eu/concept/base/17': 'Dorëshkrimi',
  'http://data.europeana.eu/agent/base/57083': 'Gustave Doré',
  'http://data.europeana.eu/agent/base/146799': 'Doris Day'
};

describe('components/search/SearchQueryOptions', () => {
  describe('suggestions', () => {
    it('shows each suggestion', () => {
      const wrapper = factory();
      const autoSuggestWrapper = wrapper.find('[data-qa="search suggestions"]');

      autoSuggestWrapper.setProps({
        value: suggestions
      });

      const suggestionElements = autoSuggestWrapper.findAll('[data-qa$="search suggestion"]');
      const suggestionValues = Object.values(suggestions);

      suggestionElements.length.should.eq(suggestionValues.length);

      suggestionValues.forEach((value, index) => {
        value.should.include(suggestionElements.at(index).text());
      });
    });

    it('highlights matching characters', () => {
      const wrapper = factory();
      const autoSuggestWrapper = wrapper.find('[data-qa="search suggestions"]');

      autoSuggestWrapper.setProps({
        value: suggestions,
        query
      });

      const highlightedElements = autoSuggestWrapper.findAll('[data-qa="search suggestion"] [data-qa="highlighted"]');

      highlightedElements.wrappers.forEach((element) => {
        element.text().toLowerCase().should.eq(query.toLowerCase());
      });
    });

    it('is navigable by keyboard on the parent input', () => {
      const wrapper = factory();
      const searchInput = wrapper.find('#searchbox');
      const autoSuggestWrapper = wrapper.find('[data-qa="search suggestions"]');

      autoSuggestWrapper.setProps({
        value: suggestions,
        query
      });

      searchInput.trigger('keydown.down');
      autoSuggestWrapper.vm.focus.should.eq(0);
      searchInput.trigger('keydown.down');
      autoSuggestWrapper.vm.focus.should.eq(1);
      searchInput.trigger('keydown.up');
      autoSuggestWrapper.vm.focus.should.eq(0);
      // TODO: re-adjust integers with buttons now added to list
      // searchInput.trigger('keydown.up');
      // autoSuggestWrapper.vm.focus.should.eq(2);
      // searchInput.trigger('keydown.down');
      // autoSuggestWrapper.vm.focus.should.eq(0);
    });

    it('is closable by esc key on the parent input', () => {
      const wrapper = factory();
      const searchInput = wrapper.find('#searchbox');
      const autoSuggestWrapper = wrapper.find('[data-qa="search suggestions"]');

      autoSuggestWrapper.setProps({
        value: suggestions,
        query
      });
      searchInput.trigger('keydown.esc');

      autoSuggestWrapper.attributes('aria-hidden').should.eq('true');
    });
  });

  describe('search button option', () => {
    context('on suggestions list', () => {
      const wrapper = factory();
      const autoSuggestWrapper = wrapper.find('[data-qa="search suggestions"]');
      autoSuggestWrapper.setProps({
        value: suggestions,
        query,
        enableAutoSuggest: true
      });
      const searchButton = wrapper.find('[data-qa="search button"]');

      it('contains the search button', () => {
        searchButton.attributes().class.should.contain('search');
        searchButton.isVisible().should.be.true;
      });
    });
  });
});
