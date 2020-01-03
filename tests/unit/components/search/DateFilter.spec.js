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

// FIXME: stop using nextTick because failures are not flagged correctly
describe('components/search/DateFilter', () => {
  it('emits `dateFilter` event with name and form arguments when user changes Start date input', async() => {
    const wrapper = factory();
    const startInput = wrapper.find('[data-qa="date range start input"]');

    startInput.trigger('change');
    wrapper.vm.form.start = '2019-01-01';
    wrapper.vm.form.specific = false;

    localVue.nextTick(() => {
      wrapper.emitted()['dateFilter'].should.eql([[ 'proxy_dcterms_issued', { 'end': null, 'start': '2019-01-01', 'specific': false } ]]);
    });
  });

  it('emits `dateFilter` event with name and form arguments when user changes End date input', async() => {
    const wrapper = factory();
    const endInput = wrapper.find('[data-qa="date range end input"]');

    endInput.trigger('change');
    wrapper.vm.form.specific = false;
    wrapper.vm.form.end = '2019-01-01';

    localVue.nextTick(() => {
      wrapper.emitted()['dateFilter'].should.eql([[ 'proxy_dcterms_issued', { 'end': '2019-01-01', 'start': null, 'specific': false } ]]);
    });
  });

  it('should not display end date field when specific is selected', async() => {
    const wrapper = factory();
    const startInput = wrapper.find('[data-qa="date range end input"]');

    startInput.trigger('change');
    wrapper.vm.form.specific = true;
    wrapper.vm.form.start = '2019-01-01';

    localVue.nextTick(() => {
      wrapper.find('[data-qa="date range end input"]').exists().should.be.false;
    });
  });
});
