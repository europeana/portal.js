import { createLocalVue, shallowMount } from '@vue/test-utils';
import * as vue2RouterHelpers from 'vue2-helpers/vue-router';
import sinon from 'sinon';
import { reactive } from 'vue';
import EntityOrganisationsPageContent from './EntityOrganisationsPageContent.vue';

const localVue = createLocalVue();

const factory = (options) => {
  sinon.stub(vue2RouterHelpers, 'useRoute').returns(reactive({ hash: options.hash || '' }));

  return shallowMount(EntityOrganisationsPageContent, {
    localVue,
    mocks: {
      $t: (val) => val
    },
    stubs: ['b-col', 'client-only', 'EntityTable']
  });
};

describe('components/entity/organisations/EntityOrganisationsPageContent', () => {
  afterEach(() => {
    sinon.resetHistory();
    vue2RouterHelpers.useRoute.restore?.();
  });

  describe('template', () => {
    describe('when visiting the institutions tab', () => {
      it('shows the institutions description and table', () => {
        const wrapper = factory({ hash: '#institutions' });

        const description = wrapper.find('.tab-header');
        const table = wrapper.find('entitytable-stub[type="organisations"]');

        expect(description.text()).toBe('organisations.providingInstitutions.description');
        expect(table.exists()).toBe(true);
      });
    });
    describe('when visiting the aggregators tab', () => {
      it('shows the aggregators description', () => {
        const wrapper = factory({ hash: '#aggregators' });

        const description = wrapper.find('.tab-header');
        const tables = wrapper.findAll('entitytable-stub');

        expect(description.text()).toBe('organisations.aggregators.description');
        expect(tables.length).toBe(2);
      });

      ['internationalAggregators', 'regionalAggregators'].forEach(type => {
        it(`shows the ${type} type title, description and table`, () => {
          const wrapper = factory({ hash: '#aggregators' });

          const title = wrapper.find(`.${type}-header h2`);
          const description = wrapper.find(`.${type}-header p`);
          const table = wrapper.find(`entitytable-stub[type="${type}"`);

          expect(title.text()).toBe(`organisations.${type}.title`);
          expect(description.text()).toBe(`organisations.${type}.description`);
          expect(table.exists()).toBe(true);
        });
      });
    });
  });
});
