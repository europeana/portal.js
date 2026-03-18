import { createLocalVue, shallowMount } from '@vue/test-utils';

import mixin from '@/mixins/similarItems.js';

const component = {
  template: '<div></div>',
  mixins: [mixin]
};

const localVue = createLocalVue();

const factory = () => shallowMount(component, {
  localVue
});

describe('mixins/similarItems', () => {
  describe('methods', () => {
    describe('similarItemsQuery', () => {
      const wrapper = factory();
      const similarItemsQuery = wrapper.vm.similarItemsQuery;

      const about = '/12345/abcde';

      it('fields on `what` for dcType, boosted by 0.8', () => {
        const data = {
          dcType: ['Type']
        };

        expect(similarItemsQuery(about, data)).toContain('what:("Type")^0.8');
      });

      it('fields on `what` for dcSubject, boosted by 0.8', () => {
        const data = {
          dcSubject: ['Subject']
        };

        expect(similarItemsQuery(about, data)).toContain('what:("Subject")^0.8');
      });

      it('fields on `who` for dcCreator, boosted by 0.5', () => {
        const data = {
          dcCreator: ['Creator']
        };

        expect(similarItemsQuery(about, data)).toContain('who:("Creator")^0.5');
      });

      it('fields on `DATA_PROVIDER` for edmDataProvider, boosted by 0.2', () => {
        const data = {
          edmDataProvider: ['Data Provider']
        };

        expect(similarItemsQuery(about, data)).toContain('DATA_PROVIDER:("Data Provider")^0.2');
      });

      it('excludes the current item by `europeana_id`', () => {
        const data = {
          dcType: ['Type']
        };

        expect(similarItemsQuery(about, data)).toContain(' NOT europeana_id:"/12345/abcde"');
      });

      it('escapes Lucene special characters in each term', () => {
        const data = {
          dcType: ['http://www.example.org/vocabulary/term']
        };

        expect(similarItemsQuery(about, data)).toContain('"http\\:\\/\\/www.example.org\\/vocabulary\\/term"');
      });

      it('combines each term per-field with OR', () => {
        const data = {
          dcSubject: ['Subject1'],
          dcType: ['Type1', 'Type2']
        };

        expect(similarItemsQuery(about, data)).toContain('("Subject1" OR "Type1" OR "Type2")');
      });

      it('combines all fielded terms with OR', () => {
        const data = {
          dcCreator: ['Creator'],
          dcType: ['Type']
        };

        expect(similarItemsQuery(about, data)).toContain('(what:("Type")^0.8 OR who:("Creator")^0.5)');
      });

      it('omits empty fields', () => {
        const data = {
          dcCreator: [],
          dcType: ['Type']
        };

        expect(similarItemsQuery(about, data)).not.toContain('who:(');
      });

      it('handles no relevant query terms sensibly', () => {
        const data = {};

        expect(similarItemsQuery(about, data)).toBe(null);
      });
    });
  });
});
