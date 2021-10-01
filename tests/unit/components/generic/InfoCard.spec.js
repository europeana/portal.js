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
  it('shows a cards', () => {
    const wrapper = factory();

    wrapper.findAll('[data-qa="info card"]').length.should.eq(1);
  });
  it('shows a smartlink for the url', async() => {
    const wrapper = factory();

    wrapper.findAll('smartlink-stub').length.should.eq(1);
  });
  it('shows an icon based of the passed in image', async() => {
    const wrapper = factory();

    wrapper.findAll('.card-img span.ic-image').length.should.eq(1);
  });
  it('contains the info', async() => {
    const wrapper = factory();

    wrapper.find('[data-qa="card info"]').text().should.eq('12,000,000');
  });
  it('contains the label', async() => {
    const wrapper = factory();

    wrapper.find('b-card-text-stub').text().should.eq('IMAGE');
  });
  describe('cardClass', () => {
    it('is based on the variant', async() => {
      const wrapper = factory();

      wrapper.vm.cardClass.should.eq('default-card');
    });
  });
});
