import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../utils';

import mixin from '@/mixins/advancedSearch';

const component = {
  template: '<div></div>',
  mixins: [mixin]
};

const localVue = createLocalVue();

const factory = ({ mocks = {} } = {}) => shallowMountNuxt(component, {
  localVue,
  mocks: {
    $route: {
      query: {}
    },
    $t: (key) => key,
    ...mocks
  }
});

describe('mixins/advancedSearch', () => {
  describe('methods', () => {
    describe('advancedSearchFieldByName', () => {
      it('looks up the field based on the name attribute', () => {
        const wrapper = factory();

        const advancedSearchField = wrapper.vm.advancedSearchFieldByName('proxy_dc_date');

        expect(advancedSearchField).toStrictEqual({ name: 'proxy_dc_date', type: 'string', suggestEntityType: 'timespan' });
      });
    });
    describe('advancedSearchFieldSupportsExact', () => {
      describe('when the field is configured to support exact match searches', () => {
        it('returns true', () => {
          const wrapper = factory();

          const supportsExact = wrapper.vm.advancedSearchFieldSupportsExact('fulltext');
          expect(supportsExact).toBe(true);
        });
      });
      describe('when the field is NOT configured to support exact match searches', () => {
        it('returns false', () => {
          const wrapper = factory();

          const supportsExact = wrapper.vm.advancedSearchFieldSupportsExact('fullproxy_dc_date');
          expect(supportsExact).toBe(false);
        });
      });
    });
    describe('advancedSearchFieldLabel', () => {
      it('translates "year" label for "YEAR" field', () => {
        const wrapper = factory();

        const advancedSearchFieldLabel = wrapper.vm.advancedSearchFieldLabel('YEAR');

        expect(advancedSearchFieldLabel).toBe('fieldLabels.default.year');
      });

      it('translates camel-cased field labels without proxy_ prefix for other fields', () => {
        const wrapper = factory();

        const advancedSearchFieldLabel = wrapper.vm.advancedSearchFieldLabel('proxy_dc_type');

        expect(advancedSearchFieldLabel).toBe('fieldLabels.default.dcType');
      });
    });

    describe('advancedSearchRouteQueryFromRules', () => {
      it('constructs a new route from advanced search rules', () => {
        const rules = [
          { field: 'proxy_dc_title', modifier: 'contains', term: 'den haag' },
          { field: 'proxy_dc_type', modifier: 'doesNotContain', suggestEntityType: 'concept', term: 'photograph' }
        ];
        const $route = {
          path: '/en/search',
          query: { query: 'bone', page: 2 }
        };
        const wrapper = factory({ mocks: { $route } });

        const advancedSearchRouteQueryFromRules = wrapper.vm.advancedSearchRouteQueryFromRules(rules);

        expect(advancedSearchRouteQueryFromRules).toEqual({
          path: '/en/search',
          query: {
            page: 1,
            qa: [
              'proxy_dc_title:den\\ haag',
              '-proxy_dc_type:photograph'
            ],
            query: 'bone'
          }
        });
      });
      describe('when search rules are cleared', () => {
        it('deletes the advanced search query from the route', () => {
          const rules = [];
          const $route = {
            path: '/en/search',
            query: {
              query: 'bone',
              page: 2,
              qa: [
                'proxy_dc_title:den\\ haag',
                '-proxy_dc_type:photograph'
              ]
            }
          };
          const wrapper = factory({ mocks: { $route } });

          const advancedSearchRouteQueryFromRules = wrapper.vm.advancedSearchRouteQueryFromRules(rules);

          expect(advancedSearchRouteQueryFromRules).toEqual({
            path: '/en/search',
            query: {
              page: 1,
              query: 'bone'
            }
          });
        });
      });
    });

    describe('advancedSearchRulesFromRouteQuery', () => {
      it('extracts advanced search rules from route query, ignoring unknown', () => {
        const $route = {
          query: {
            qa: [
              'proxy_dc_title:den\\ haag',
              '-proxy_dc_type:photograph',
              'proxy_dc_language:en',
              'fulltext:(europe)'
            ]
          }
        };
        const wrapper = factory({ mocks: { $route } });

        const advancedSearchRulesFromRouteQuery = wrapper.vm.advancedSearchRulesFromRouteQuery();

        expect(advancedSearchRulesFromRouteQuery).toEqual([
          { field: 'proxy_dc_title', modifier: 'contains', term: 'den haag' },
          { field: 'proxy_dc_type', modifier: 'doesNotContain', suggestEntityType: 'concept', term: 'photograph' },
          { field: 'fulltext', modifier: 'contains', term: 'europe' }
        ]);
      });
    });
  });
});
