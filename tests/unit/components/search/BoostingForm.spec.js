import { createLocalVue, shallowMount } from '@vue/test-utils';
import BoostingForm from '@/components/search/BoostingForm.vue';
import BootstrapVue from 'bootstrap-vue';
import Vuex from 'vuex';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);

const gotoSpy = sinon.spy();

const factory = () => shallowMount(BoostingForm, {
  localVue,
  mocks: {
    $t: (key) => key,
    $route: {
      path: 'search',
      query: {
        query: 'paris',
        qf: 'DATA_PROVIDER%3A"National Library of France"',
        page: 2,
        boost: 'ORIGINAL_DUMMY_BOOST_VALUE'
      }
    },
    $goto: gotoSpy
  }
});

describe('components/search/BoostingForm', () => {
  describe('form submission', () => {
    it('redirects to page one of the current route with the new boosting query added', () => {
      const wrapper = factory();

      wrapper.vm.boost = 'NEW_DUMMY_BOOST';
      wrapper.vm.submitForm();
      const expectedGoToArgs = {
        path: 'search',
        query: {
          query: 'paris',
          qf: 'DATA_PROVIDER%3A"National Library of France"',
          page: 1,
          boost: 'NEW_DUMMY_BOOST'
        }
      };
      expect(gotoSpy.calledWith(expectedGoToArgs)).toBe(true);
    });
  });

  describe('initialisation', () => {
    it('sets the boost from the query', () => {
      const wrapper = factory();

      expect(wrapper.vm.boost).toBe('ORIGINAL_DUMMY_BOOST_VALUE');
    });
  });
});
