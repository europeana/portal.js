import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import NotificationBanner from '../../../../src/components/generic/NotificationBanner.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(NotificationBanner, {
  localVue,
  propsData: { notificationUrl: 'https://classic.europeana.eu?utm_source=new-website&utm_medium=button',
    notificationText: 'You\'re viewing the new Europeana experience.',
    notificationLinkText: 'Go to the original Europeana' }
});

describe('components/generic/NotificationBanner', () => {
  it('shows a notification banner', () => {
    const wrapper = factory();

    wrapper.text().should.contain('You\'re viewing the new Europeana experience.');
    wrapper.find('a').attributes().href.should.eq('https://classic.europeana.eu?utm_source=new-website&utm_medium=button');
    wrapper.find('a').text().should.eq('Go to the original Europeana');
  });
});
