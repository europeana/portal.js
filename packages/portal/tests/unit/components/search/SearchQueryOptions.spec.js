import { createLocalVue, shallowMount, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import VueI18n from 'vue-i18n';
import SearchQueryOptions from '@/components/search/SearchQueryOptions.vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(VueI18n);

const suggestStub = sinon.stub().resolves([{ prefLabel: { en: 'Medicine' }, id: 'http://data.europeana.eu/concept/001' }]);

const mocks = {
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
  localePath: () => {}
};

const stubs = {
  i18n: true,
  TextHighlighter: { template: '<div></div>' }
};

const suggestions = { 'http://data.europeana.eu/concept/001': 'Medicine',
  'http://data.europeana.eu/agent/002': 'Lucius Mestrius Plutarchus' };

const factory = (options = {}) => shallowMount(SearchQueryOptions, {
  localVue,
  i18n: new VueI18n({ locale: 'en' }),
  data() {
    return { suggestions, ...options.data };
  },
  propsData: options.propsData,
  mocks: {
    ...mocks,
    ...options.mocks
  },
  stubs
});

const component = {
  template: `<div>
      <div ref="searchdropdown">
        <input ref="searchinput"/>
        <button id="show-search-button">show search button</button>
        <SearchQueryOptions ref="searchoptions" :show-search-options="showSearchOptions"></SearchQueryOptions>
      </div>
    </div>`,
  components: { SearchQueryOptions }
};

const parentFactory = () => mount(component, {
  localVue,
  data() {
    return { showSearchOptions: false };
  },
  mocks,
  stubs
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
    it('tracks the chosen suggestion', async() => {
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

  describe('watch', () => {
    describe('showSearchOptions', () => {
      describe('when true', () => {
        it('adds event listeners to parent searchdropdown', async() => {
          const wrapper = parentFactory();
          const searchOptionsComponent = wrapper.find('[data-qa="search query options"]');

          const addEventListener = sinon.spy(searchOptionsComponent.vm.$parent.$refs.searchdropdown, 'addEventListener');
          await wrapper.setData({ showSearchOptions: true });

          expect(addEventListener.called).toBe(true);
        });
      });

      describe('when false', () => {
        it('removes event listeners from parent searchdropdown', async() => {
          const wrapper = parentFactory();
          const searchOptionsComponent = wrapper.find('[data-qa="search query options"]');

          const removeEventListener = sinon.spy(searchOptionsComponent.vm.$parent.$refs.searchdropdown, 'removeEventListener');
          await wrapper.setData({ showSearchOptions: true });
          await wrapper.setData({ showSearchOptions: false });

          expect(removeEventListener.called).toBe(true);
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

            expect(wrapper.vm.$matomo.trackEvent.calledWith('Advanced search autosuggest', 'Advanced search autosuggest option is selected', 'what: Medicine')).toBe(true);
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

    describe('handleFocusOut', () => {
      const wrapper = parentFactory();
      const searchOptionsComponent = wrapper.find('[data-qa="search query options"]');
      describe('when user clicks outside the search form dropdown', () => {
        it('hides the search options', async() => {
          const handleFocusOutEvent = new Event('click');

          searchOptionsComponent.vm.handleFocusOut(handleFocusOutEvent);

          expect(searchOptionsComponent.emitted('show').length).toBe(1);
          expect(searchOptionsComponent.emitted('show')[0]).toEqual([false]);
        });
      });

      describe('when user tabs outside the search form dropdown', () => {
        it('hides the search options', async() => {
          const tabOutsideEvent = new KeyboardEvent('keydown', { key: 'Tab' });

          searchOptionsComponent.vm.handleFocusOut(tabOutsideEvent);

          expect(searchOptionsComponent.emitted('show').length).toBe(2);
          expect(searchOptionsComponent.emitted('show')[1]).toEqual([false]);
        });
      });
    });

    describe('handleKeyDown', () => {
      const handleKeyDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });

      const wrapper = parentFactory();
      const searchOptionsComponent = wrapper.find('[data-qa="search query options"]');

      const navigateWithArrowKeys = sinon.spy(searchOptionsComponent.vm, 'navigateWithArrowKeys');

      describe('when using the down arrow key', () => {
        it('navigates through the options', () => {
          searchOptionsComponent.vm.handleKeyDown(handleKeyDownEvent);

          expect(navigateWithArrowKeys.calledWith(handleKeyDownEvent)).toBe(true);
        });
      });

      describe('when using the up arrow key', () => {
        it('navigates through the options', async() => {
          await searchOptionsComponent.setData({ suggestions });

          const mockEvent = {
            target: searchOptionsComponent.vm.$refs.options[1],
            key: 'ArrowUp',
            preventDefault: () => {}
          };
          searchOptionsComponent.vm.handleKeyDown(mockEvent);

          expect(navigateWithArrowKeys.calledWith(mockEvent)).toBe(true);
        });
      });

      describe('when using the Escape key', () => {
        it('emits the show event with false value', () => {
          const handleKeyDownEvent = new KeyboardEvent('keydown', { key: 'Escape' });
          const wrapper = parentFactory();
          const searchOptionsComponent = wrapper.find('[data-qa="search query options"]');

          searchOptionsComponent.vm.handleKeyDown(handleKeyDownEvent);

          expect(searchOptionsComponent.emitted('show')[0]).toEqual([false]);
        });
      });
    });
  });
});
