import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import AlertMessage from '../../../../src/components/generic/AlertMessage.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(AlertMessage, {
  localVue,
  mocks: {
    $t: () => {}
  }
});

describe('components/generic/AlertMessage', () => {
  it('show an error message', () => {
    const wrapper = factory();
    wrapper.setProps({ error: 'No results' });

    const message =  wrapper.find('[data-qa="error notice"]');
    message.text().should.contain('No results');
  });
});
