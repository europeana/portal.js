import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import LinkBadge from '@/components/generic/LinkBadge.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(LinkBadge, {
  localVue,
  mocks: {
    $i18n: {
      locale: 'en'
    }
  },
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

  it('is a smart link', async() => {
    const wrapper = factory();
    await wrapper.setProps({
      linkTo: '/collections/topic/190-art'
    });

    expect(wrapper.attributes('destination')).toEqual('/collections/topic/190-art');
  });

  it('has a collection title, lang', async() => {
    const wrapper = factory();
    await wrapper.setProps({
      linkTo: '/collections/topic/190-art',
      title: 'Art'
    });

    const chip = wrapper.find('[data-qa="Art related chip"]');
    expect(chip.text()).toBe('Art');
  });

  it('translates lang maps for title', async() => {
    const wrapper = factory();

    await wrapper.setProps({
      linkTo: '/collections/topic/33-costume',
      title: {
        en: 'Costume'
      }
    });

    const chip = wrapper.find('[data-qa="Costume related chip"]');
    expect(chip.text()).toBe('Costume');
  });
});
