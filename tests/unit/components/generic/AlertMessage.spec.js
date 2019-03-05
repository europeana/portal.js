import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import AlertMessage from '../../../../components/generic/AlertMessage.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(AlertMessage, {
  localVue
});

describe('AlertMessage', () => {
  it('show an error message', () => {
    const wrapper = factory();
    wrapper.setProps({ error: 'No results' });

    const message =  wrapper.find('[data-qa="alert message"]');
    message.text().should.contain('No results');
  });
});
