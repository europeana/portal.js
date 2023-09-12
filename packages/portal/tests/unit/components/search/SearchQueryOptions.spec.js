import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import VueI18n from 'vue-i18n';
import SearchQueryOptions from '@/components/search/SearchQueryOptions.vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(VueI18n);

const suggestions = { 'http://data.europeana.eu/concept/001': 'Medicine',
  'http://data.europeana.eu/agent/002': 'Lucius Mestrius Plutarchus' };

const suggestStub = sinon.stub().resolves([{ prefLabel: { en: 'Medicine' }, id: 'http://data.europeana.eu/concept/001' }]);

const factory = (options = {}) => shallowMount(SearchQueryOptions, {
  localVue,
  i18n: new VueI18n({ locale: 'en' }),
  data() {
    return { suggestions, ...options.data };
  },
  propsData: options.propsData,
  mocks: {
    $apis: { entity: { suggest: suggestStub } },
    $route: { query: {} },
    $t: (key) => key,
    $link: {
      to: route => route,
      href: () => null
    },
    $matomo: {
      trackEvent: sinon.spy()
    },
    localePath: () => {},
    ...options.mocks
  },
  stubs: {
    TextHighlighter: { template: '<div></div>' }
  }
});

describe('components/search/SearchQueryOptions', () => {
  afterEach(sinon.resetHistory);

  describe('when the query text changes', () => {
    it('fetches suggestions', async() => {
      const wrapper = factory();
      const fetch = sinon.spy(wrapper.vm, 'fetchSuggestions');
      const text = 'med';
      await wrapper.setProps({ text });

      expect(fetch.called).toBe(true);
    });
  });

  describe('when the search form is submitting', () => {
    it('tracks the chose suggestion', async() => {
      const wrapper = factory();
      const track = sinon.spy(wrapper.vm, 'trackSuggestionClick');
      const submitting = 'med';
      await wrapper.setProps({ submitting });

      expect(track.called).toBe(true);
    });
  });

  describe('computed', () => {
    describe('collectionSearchOption', () => {
      describe('when there is text input', () => {
        it('shows the text in the option label', () => {
          const collectionRoute = { name: 'collections-type-all__en' };
          const wrapper = factory({ propsData: { text: 'med' },
            mocks:
      { $route: collectionRoute,
        $store: { state: { search: { collectionLabel: 'Medicine' } } } } });

          const label = wrapper.vm.collectionSearchOption.i18n.path;

          expect(label).toEqual('header.inCollection');
        });
      });
    });
  });

  describe('methods', () => {
    describe('fetchSuggestions', () => {
      describe('when suggest is disabled', () => {
        it('does not fetch suggetions', async() => {
          const wrapper = factory({ propsData: { suggest: false } });
          sinon.spy(wrapper.vm, 'fetchSuggestions');

          await wrapper.vm.fetchSuggestions();

          expect(suggestStub.called).toBe(false);
        });
      });

      describe('while already fetching', () => {
        it('does not fetch suggetions', async() => {
          const wrapper = factory({ propsData: { text: 'med' },  data: { gettingSuggestions: true } });
          sinon.spy(wrapper.vm, 'fetchSuggestions');

          await wrapper.vm.fetchSuggestions();

          expect(suggestStub.called).toBe(false);
        });
      });

      describe('when the request errors', () => {
        it('sets a failed state', async() => {
          const mocks = { $apis: { entity: { suggest: sinon.stub().rejects() } } };
          const wrapper = factory({ propsData: { text: 'med' }, mocks });
          sinon.spy(wrapper.vm, 'fetchSuggestions');

          await wrapper.vm.fetchSuggestions();

          const fetchFailedState = wrapper.vm.fetchFailed;

          expect(fetchFailedState).toEqual(true);
        });
      });
    });

    describe('trackSuggestionClick', () => {
      describe('when in the context of the advanced search', () => {
        describe('and the first option is selected', () => {
          it('tracks the not selected event', () => {
            const wrapper = factory({ propsData: { advancedSearch: true, advancedSearchField: 'what' } });

            const option = wrapper.find('[data-qa="search entire collection button"]');
            option.trigger('click');

            expect(wrapper.vm.$matomo.trackEvent.calledWith('Advanced search autosuggest', 'Advanced search autosuggest option is not selected', 'what: undefined')).toBe(true);
          });
        });
        describe('and not the first option', () => {
          it('tracks the selected event and the clicked suggestion', () => {
            const wrapper = factory({ propsData: { advancedSearch: true, advancedSearchField: 'what' } });

            const option = wrapper.find('[data-qa="Medicine search suggestion"]');
            option.trigger('click');

            expect(wrapper.vm.$matomo.trackEvent.calledWith('Advanced search autosuggest', 'Advanced search autosuggest option is selected', 'what: "Medicine"')).toBe(true);
          });
        });
      });

      describe('when on collection page', () => {
        it('does not track the suggestion click', () => {
          const collectionRoute = { name: 'collections-type-all__en' };
          const wrapper = factory({ mocks:
        { $route: collectionRoute,
          $store: { state: { search: { collectionLabel: 'Medicine' } } } } });

          const option = wrapper.find('[data-qa="search in collection button"]');
          option.trigger('click');

          expect(wrapper.vm.$matomo.trackEvent.called).toBe(false);
        });
      });

      describe('when not on a collection page', () => {
        describe('and the first option is selected', () => {
          it('tracks the not selected event', () => {
            const wrapper = factory();

            const option = wrapper.find('[data-qa="search entire collection button"]');
            option.trigger('click');

            expect(wrapper.vm.$matomo.trackEvent.calledWith('Autosuggest_option_not_selected', 'Autosuggest option is not selected', undefined)).toBe(true);
          });
        });
        describe('and not the first option', () => {
          it('tracks the selected event and the clicked suggestion', () => {
            const wrapper = factory();

            const option = wrapper.find('[data-qa="Medicine search suggestion"]');
            option.trigger('click');

            expect(wrapper.vm.$matomo.trackEvent.calledWith('Autosuggest_option_selected', 'Autosuggest option is selected', '"Medicine"')).toBe(true);
          });
        });
      });
    });
  });
});
