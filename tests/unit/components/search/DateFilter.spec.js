import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import DateFilter from '../../../../components/search/DateFilter.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);


const factory = () => mount(DateFilter, {
  localVue,
  mocks: {
    $t: (key) => key
  },
  propsData: {
    name: 'proxy_dcterms_issued',
    start: null,
    end: null
  }
});

describe('components/search/DateFilter', () => {
  it('emits `dateFilter` event with name and form arguments when user changes Start date input', async() => {
    const wrapper = factory();
    const startInput = wrapper.find('[data-qa="date range start input"]');

    startInput.trigger('change');
    wrapper.vm.form.start = '2019-01-01';

    wrapper.emitted()['dateFilter'].should.eql([[ 'proxy_dcterms_issued', { 'end': null, 'start': '2019-01-01' } ]]);
  });

  it('emits `dateFilter` event with name and form arguments when user changes End date input', async() => {
    const wrapper = factory();
    const endInput = wrapper.find('[data-qa="date range end input"]');

    endInput.trigger('change');
    wrapper.vm.form.end = '2019-01-01';

    wrapper.emitted()['dateFilter'].should.eql([[ 'proxy_dcterms_issued', { 'end': '2019-01-01', 'start': null } ]]);
  });
});
