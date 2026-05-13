import { createLocalVue, shallowMount } from '@vue/test-utils';
import * as vue2RouterHelpers from 'vue2-helpers/vue-router';
import sinon from 'sinon';
import { reactive } from 'vue';
import EntityOrganisationsPageContent from '@/components/entity/EntityOrganisationsPageContent.vue';

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

describe('components/entity/EntityOrganisationsPageContent', () => {
  afterEach(() => {
    sinon.resetHistory();
    vue2RouterHelpers.useRoute.restore?.();
  });

  describe('template', () => {
    describe('when visiting the institutions tab', () => {
      it('shows the institutions description and table', () => {
        const wrapper = factory({ hash: '#institutions' });

        const description = wrapper.find('b-col-stub');
        const table = wrapper.find('entitytable-stub[type="organisations"]');

        expect(description.text()).toBe('organisations.providingInstitutions.description');
        expect(table.exists()).toBe(true);
      });
    });
    describe('when visiting the aggregators tab', () => {
      it('shows the aggregators description', () => {
        const wrapper = factory({ hash: '#aggregators' });

        const description = wrapper.find('b-col-stub');
        const table = wrapper.find('entitytable-stub[type="organisations"]');

        expect(description.text()).toBe('organisations.aggregators.description');
        expect(table.exists()).toBe(false);
      });
    });
  });
});
