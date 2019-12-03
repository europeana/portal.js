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
    start: '00/00/0000',
    end: '00/00/0000'
  }
});

describe('components/search/DateFilter', () => {
  it('emits `dateFilter` event with name and form arguments when user changes Start date input', async() => {
    const wrapper = factory();
    const startInput = wrapper.find('[data-qa="start input"]');

    startInput.trigger('change');
    wrapper.vm.form.start = '10/02/2019';

    wrapper.emitted()['dateFilter'].should.eql([[ 'proxy_dcterms_issued', { 'end': '00/00/0000', 'start': '10/02/2019' } ]]);
  });

  it('emits `dateFilter` event with name and form arguments when user changes End date input', async() => {
    const wrapper = factory();
    const endInput = wrapper.find('[data-qa="end input"]');

    endInput.trigger('change');
    wrapper.vm.form.end = '10/02/2019';

    wrapper.emitted()['dateFilter'].should.eql([[ 'proxy_dcterms_issued', { 'end': '10/02/2019', 'start': '00/00/0000' } ]]);
  });
});
