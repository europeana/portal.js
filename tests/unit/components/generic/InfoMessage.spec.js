import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import InfoMessage from '@/components/generic/InfoMessage.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (slots) => shallowMount(InfoMessage, {
  localVue,
  slots,
  mocks: {
    $t: () => {}
  }
});

describe('components/generic/InfoMessage', () => {
  it('show an info message', async() => {
    const wrapper = factory({ default: 'Some information to display' });

    const message =  wrapper.find('[data-qa="info notice"]');
    message.text().should.contain('Some information to display');
  });
});
