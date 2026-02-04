import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import NotificationBanner from '@/components/generic/NotificationBanner.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(NotificationBanner, {
  localVue,
  propsData: { url: 'https://classic.europeana.eu?utm_source=new-website&utm_medium=button',
    text: 'You\'re viewing the new Europeana experience.',
    linkText: 'Go to the original Europeana' },
  mocks: {
    $t: () => {}
  }
});

describe('components/generic/NotificationBanner', () => {
  it('shows a notification banner', () => {
    const wrapper = factory();

    expect(wrapper.text()).toContain('You\'re viewing the new Europeana experience.');
    expect(wrapper.find('a').attributes().href).toBe('https://classic.europeana.eu?utm_source=new-website&utm_medium=button');
    expect(wrapper.find('a').text()).toBe('Go to the original Europeana');
  });
});
