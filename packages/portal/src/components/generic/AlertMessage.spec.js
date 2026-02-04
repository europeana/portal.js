import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import AlertMessage from '@/components/generic/AlertMessage.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(AlertMessage, {
  localVue,
  mocks: {
    $t: () => {}
  }
});

describe('components/generic/AlertMessage', () => {
  it('shows a string error message', async() => {
    const wrapper = factory();
    const error = 'No results';
    await wrapper.setProps({ error });

    const notice =  wrapper.find('[data-qa="error notice"]');
    expect(notice.text()).toContain(error);
  });

  it('shows an object error message', async() => {
    const wrapper = factory();
    const message = 'Fetch error';
    await wrapper.setProps({ error: { message } });

    const notice =  wrapper.find('[data-qa="error notice"]');
    expect(notice.text()).toContain(message);
  });
});
