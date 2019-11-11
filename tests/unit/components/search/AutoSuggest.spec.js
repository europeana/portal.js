import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import AutoSuggest from '../../../../components/search/AutoSuggest.vue';
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
    AutoSuggest
  },
  template: '<div><input ref="searchbox" type="text" /><AutoSuggest /></div>'
};

const factory = (options = {}) => {
  return mount(parentInputComponent, {
    localVue,
    attachToDocument: true,
    mocks: {
      ...{
        $t: () => {},
        localePath: (opts) => {
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

const suggestions = {
  '/en/entity/topic/83': {
    'en': 'World War I',
    'fr': 'Première Guerre mondiale'
  },
  '/en/entity/topic/94': {
    'en': 'Architecture',
    'fr': 'Architecture'
  }
};

describe('components/search/AutoSuggest', () => {
  describe('suggestions', () => {
    it('is hidden when there are no suggestions', () => {
      const wrapper = factory();

      wrapper.find('[data-qa="search suggestions"]').isVisible().should.be.false;
    });

    it('is shown when suggestions are set', () => {
      const wrapper = factory();
      const autoSuggestWrapper = wrapper.find('[data-qa="search suggestions"]');

      autoSuggestWrapper.setProps({
        value: suggestions
      });

      autoSuggestWrapper.isVisible().should.be.true;
    });

    it('shows each suggestion', () => {
      const wrapper = factory();
      const autoSuggestWrapper = wrapper.find('[data-qa="search suggestions"]');

      autoSuggestWrapper.setProps({
        value: suggestions
      });

      const suggestionElements = autoSuggestWrapper.findAll('[data-qa="search suggestion"]');
      suggestionElements.length.should.eq(Object.values(suggestions).length);

      suggestionElements.at(0).text().should.eq(Object.values(suggestions)[0].en);
      suggestionElements.at(1).text().should.eq(Object.values(suggestions)[1].en);
    });

    // it('highlights matching characters', async() => {
    //   const wrapper = factory({
    //     store
    //   });
    //   let suggestion;
    //   wrapper.setData({ query: 'world' });
    //   await wrapper.vm.getSuggestions();
    //   suggestion = wrapper.find('[data-qa="search suggestion world war i link"]');
    //
    //   wrapper.setData({ query: 'World' });
    //   suggestion.find('[data-qa="highlighted"]').text().should.eq('World');
    //   wrapper.setData({ query: 'WORLD' });
    //   suggestion.find('[data-qa="highlighted"]').text().should.eq('World');
    //   wrapper.setData({ query: 'Wor' });
    //   suggestion.find('[data-qa="highlighted"]').text().should.eq('Wor');
    //   suggestion.find('[data-qa="base"]').text().should.eq('ld War I');
    // });
    //
    // it('allows the user to navigate through suggestions using keyboards up and down arrows', async() => {
    //   wrapper.setData({ query: 'World' });
    //   await wrapper.vm.getSuggestions();
    //   wrapper.trigger('keyup.down');
    //   wrapper.vm.focus.should.eq(0);
    //   wrapper.trigger('keyup.down');
    //   wrapper.vm.focus.should.eq(1);
    //   wrapper.trigger('keyup.up');
    //   wrapper.vm.focus.should.eq(0);
    // });
  });
});
