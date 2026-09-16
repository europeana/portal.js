import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';
import { computed, reactive } from 'vue';
import * as vueRouter from '@/composables/vueRouter.js';

import EntityOrganisationsPageContent from './EntityOrganisationsPageContent.vue';

const localVue = createLocalVue();

const factory = ({ tab = '' } = {}) => {
  sinon.stub(vueRouter, 'useRoute').returns(computed(() => reactive({ query: { tab } })));

  return shallowMount(EntityOrganisationsPageContent, {
    localVue,
    mocks: {
      $t: (val) => val
    },
    stubs: ['b-col', 'client-only', 'EntityTable', 'b-nav', 'b-nav-item']
  });
};

describe('components/entity/organisations/EntityOrganisationsPageContent', () => {
  afterEach(() => {
    sinon.resetHistory();
    vueRouter.useRoute.restore?.();
  });

  describe('template', () => {
    it('renders two tabs: providing institutions, and aggregators', () => {
      const wrapper = factory();

      const tabs = wrapper.findAll('b-nav-item-stub');

      expect(tabs.length).toBe(2);
      expect(tabs.at(0).text()).toBe('organisations.providingInstitutions.title');
      expect(tabs.at(1).text()).toBe('organisations.aggregators.title');
    });

    describe('when visiting the institutions tab', () => {
      it('shows the institutions description and table', () => {
        const wrapper = factory({ tab: 'institutions' });

        const description = wrapper.find('.tab-header');
        const table = wrapper.find('entitytable-stub[type="organisations"]');

        expect(description.text()).toBe('organisations.providingInstitutions.description');
        expect(table.exists()).toBe(true);
      });
    });
    describe('when visiting the aggregators tab', () => {
      it('shows the aggregators description', () => {
        const wrapper = factory({ tab: 'aggregators' });

        const description = wrapper.find('.tab-header');
        const tables = wrapper.findAll('entitytable-stub');

        expect(description.text()).toBe('organisations.aggregators.description');
        expect(tables.length).toBe(2);
      });

      ['internationalAggregators', 'regionalAggregators'].forEach(type => {
        it(`shows the ${type} type title, description and table`, () => {
          const wrapper = factory({ tab: 'aggregators' });

          const title = wrapper.find(`.${type}-header h2`);
          const description = wrapper.find(`.${type}-header p`);
          const table = wrapper.find(`[data-qa="${type} entity table"]`);

          expect(title.text()).toBe(`organisations.${type}.title`);
          expect(description.text()).toBe(`organisations.${type}.description`);
          expect(table.exists()).toBe(true);
        });
      });
    });
  });
});
