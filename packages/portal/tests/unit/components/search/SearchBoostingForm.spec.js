import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import SearchBoostingForm from '@/components/search/SearchBoostingForm.vue';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMountNuxt(SearchBoostingForm, {
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
    $router: { push: sinon.spy() }
  }
});

describe('components/search/SearchBoostingForm', () => {
  afterEach(sinon.resetHistory);

  describe('fetch', () => {
    it('initialises the boost from the query', () => {
      const wrapper = factory();

      wrapper.vm.$fetch();

      expect(wrapper.vm.boost).toBe('ORIGINAL_DUMMY_BOOST_VALUE');
    });
  });

  describe('watch', () => {
    describe('$route.query.boost', () => {
      it('updates the boost property', async() => {
        const wrapper = factory();

        wrapper.vm.$route.query.boost = 'NEW_DUMMY_BOOST';
        await wrapper.vm.$nextTick;

        expect(wrapper.vm.boost).toBe('NEW_DUMMY_BOOST');
      });
    });
  });

  describe('methods', () => {
    describe('submitForm', () => {
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
        expect(wrapper.vm.$router.push.calledWith(expectedGoToArgs)).toBe(true);
      });
    });
  });
});
