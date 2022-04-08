import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import InfoCard from '@/components/generic/InfoCard.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(InfoCard, {
  localVue,
  propsData: {
    url: { name: 'fakeURL' },
    info: '12,000,000',
    label: 'IMAGE',
    image: 'ic-image',
    variant: 'default'
  }
});

describe('components/generic/InfoCard', () => {
  it('shows a card', () => {
    const wrapper = factory();

    expect(wrapper.findAll('[data-qa="info card"]').length).toBe(1);
  });
  it('shows a smartlink for the url', async() => {
    const wrapper = factory();

    expect(wrapper.findAll('smartlink-stub').length).toBe(1);
  });
  it('shows an icon based of the passed in image', async() => {
    const wrapper = factory();

    expect(wrapper.findAll('.card-img span.ic-image').length).toBe(1);
  });
  it('contains the info', async() => {
    const wrapper = factory();

    expect(wrapper.find('[data-qa="card info"]').text()).toBe('12,000,000');
  });
  it('contains the label', async() => {
    const wrapper = factory();

    expect(wrapper.find('b-card-text-stub').text()).toBe('IMAGE');
  });
  describe('cardClass', () => {
    it('is based on the variant', async() => {
      const wrapper = factory();

      expect(wrapper.vm.cardClass).toBe('default-card');
    });
  });
});
