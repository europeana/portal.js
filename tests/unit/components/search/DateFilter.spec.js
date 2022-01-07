import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';

import BootstrapVue from 'bootstrap-vue';
import DateFilter from '@/components/search/DateFilter.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(DateFilter, {
  localVue,
  mocks: {
    $t: (key) => key,
    $store: {
      dispatch: sinon.stub()
    }
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

    wrapper.vm.form.start = '2019-01-01';
    wrapper.vm.form.specific = false;
    await startInput.vm.$emit('input');

    expect(wrapper.emitted('dateFilter')).toEqual([['proxy_dcterms_issued', { 'end': null, 'start': '2019-01-01', 'specific': false }]]);
  });

  it('emits `dateFilter` event with name and form arguments when user changes End date input', async() => {
    const wrapper = factory();
    const endInput = wrapper.find('[data-qa="date range end input"]');

    wrapper.vm.form.specific = false;
    wrapper.vm.form.end = '2019-01-01';
    await endInput.vm.$emit('input');

    expect(wrapper.emitted()['dateFilter']).toEqual([['proxy_dcterms_issued', { 'end': '2019-01-01', 'start': null, 'specific': false }]]);
  });

  it('should not display end date field when specific is selected', async() => {
    const wrapper = factory();
    await wrapper.setData({ form: { specific: true } });

    expect(wrapper.find('[data-qa="date range end input"]').exists()).toBe(false);
  });
});
