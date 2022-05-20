import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SearchQueryOptions from '@/components/search/SearchQueryOptions.vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const suggestions = [
  { link: { path: '/en/search', query: { query: 'me' } }, qa: 'search link 1' },
  { link: { path: '/en/search', query: { query: '"Medicine"' } }, qa: 'search link 2' }
];

const factory = (options = {}) => shallowMount(SearchQueryOptions, {
  localVue,
  propsData: options.propsData || { options: suggestions },
  mocks: {
    $t: (key) => key,
    $i18n: { locale: 'en' },
    $link: {
      to: route => route,
      href: () => null
    },
    $matomo: {
      trackEvent: sinon.spy()
    }
  },
  stubs: {
    TextHighlighter: { template: '<div></div>' }
  }
});

describe('components/search/SearchQueryOptions', () => {
  describe('when on collection page', () => {
    it('does not track the suggestion click', () => {
      const wrapper = factory();
      delete window.location;
      window.location = new URL('https://www.europeana.eu/en/collections/topic/01-topic');

      const option = wrapper.find('[data-qa="search link 1"]');
      option.trigger('click');

      expect(wrapper.vm.$matomo.trackEvent.called).toBe(false);
      window.location = new URL('https://www.europeana.eu/en');
    });
  });

  describe('when not on a collection page', () => {
    describe('and the first option is selected', () => {
      it('tracks the not selected event', () => {
        const wrapper = factory();

        const option = wrapper.find('[data-qa="search link 1"]');
        option.trigger('click');

        expect(wrapper.vm.$matomo.trackEvent.calledWith('Autosuggest_option_not_selected', 'Autosuggest option is not selected', 'me')).toBe(true);
      });
    });
    describe('and not the first option', () => {
      it('tracks the selected event and the clicked suggestion', () => {
        const wrapper = factory();

        const option = wrapper.find('[data-qa="search link 2"]');
        option.trigger('click');

        expect(wrapper.vm.$matomo.trackEvent.calledWith('Autosuggest_option_selected', 'Autosuggest option is selected', '"Medicine"')).toBe(true);
      });
    });
  });
});
