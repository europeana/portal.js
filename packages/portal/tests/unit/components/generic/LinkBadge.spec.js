import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import LinkBadge from '@/components/generic/LinkBadge.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (mocks = {}) => shallowMount(LinkBadge, {
  localVue,
  mocks,
  propsData: {
    id: '/collections/topic/190-art',
    title: 'Art'
  }
});

describe('components/generic/LinkBadge', () => {
  it('renders a related collection chip', () => {
    const wrapper = factory();
    expect(wrapper.findAll('[data-qa="Art related chip"]').length).toBe(1);
  });

  it('has a collection title, lang and link', async() => {
    const wrapper = factory();
    await wrapper.setProps({
      linkTo: '/collections/topic/190-art',
      title: 'Art'
    });

    const chip = wrapper.find('[data-qa="Art related chip"]');
    expect(chip.text()).toBe('Art');
    expect(chip.attributes().href).toBe(undefined);
    expect(chip.attributes().to).not.toBeUndefined();
  });

  it('translates lang maps for title', async() => {
    const wrapper = factory({
      $i18n: { locale: 'en' }
    });

    await wrapper.setProps({
      linkTo: '/collections/topic/33-costume',
      title: {
        en: 'Costume'
      }
    });

    const chip = wrapper.find('[data-qa="Costume related chip"]');
    expect(chip.text()).toBe('Costume');
  });

  describe('when linkTo is a URL with scheme', () => {
    it('is linked to, not routed to', async() => {
      const wrapper = factory();
      await wrapper.setProps({
        linkTo: 'https://www.example.org/collections/topic/190-art',
        title: 'Art'
      });

      const chip = wrapper.find('[data-qa="Art related chip"]');
      expect(chip.attributes().href).toBe('https://www.example.org/collections/topic/190-art');
      expect(chip.attributes().to).toBe(undefined);
    });
  });
});
