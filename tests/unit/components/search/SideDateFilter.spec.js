import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';

import BootstrapVue from 'bootstrap-vue';
import SideDateFilter from '@/components/search/SideDateFilter.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(SideDateFilter, {
  localVue,
  mocks: {
    $t: (key) => key,
    $store: {
      dispatch: sinon.stub()
    },
    $config: { app: { features: { sideFilters: false } } }
  },
  propsData: {
    name: 'proxy_dcterms_issued',
    start: null,
    end: null
  }
});

describe('components/search/SideDateFilter', () => {
  it('emits `dateFilter` event with name and form arguments when user changes Start date input', async() => {
    const wrapper = factory();
    const applyButton = wrapper.find('[data-qa="proxy_dcterms_issued apply button"]');

    wrapper.vm.form.start = '2019-01-01';
    wrapper.vm.form.specific = false;
    await applyButton.trigger('click');

    wrapper.emitted('dateFilter').should.eql([['proxy_dcterms_issued', { 'end': null, 'start': '2019-01-01', 'specific': false }]]);
  });

  it('emits `dateFilter` event with name and form arguments when user changes End date input', async() => {
    const wrapper = factory();
    const applyButton = wrapper.find('[data-qa="proxy_dcterms_issued apply button"]');

    wrapper.vm.form.specific = false;
    wrapper.vm.form.end = '2019-01-01';
    await applyButton.trigger('click');

    wrapper.emitted('dateFilter').should.eql([['proxy_dcterms_issued', { 'end': '2019-01-01', 'start': null, 'specific': false }]]);
  });

  it('should not display end date field when specific is selected', async() => {
    const wrapper = factory();
    await wrapper.setData({ form: { specific: true } });

    wrapper.find('[data-qa="date range end input"]').exists().should.be.false;
  });
});
