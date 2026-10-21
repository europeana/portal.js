import { createLocalVue, shallowMount } from '@vue/test-utils';
import PersonSection from '@/components/person/PersonSection.vue';

const localVue = createLocalVue();

const testProps = {
  people: [
    {
      image: {
        url: 'https://images.ctfassets.net/asset',
        width: 400,
        height: 600
      },
      name: 'Frida Kahlo',
      role: 'painter'
    },
    {
      name: 'Another person'
    }
  ],
  title: 'example title',
  description: 'example description _markup_'
};

const factory = (propsData = testProps) => shallowMount(PersonSection, {
  localVue,
  propsData
});

describe('components/content/PersonSection', () => {
  it('displays a title and description when present', () => {
    const wrapper = factory();

    expect(wrapper.find('h2').text()).toContain('example title');
    expect(wrapper.find('p').text()).toContain('example description markup');
  });

  it('displays cards for each person', () => {
    const wrapper = factory();

    const cards = wrapper.findAll('personcard-stub');
    expect(cards.length).toEqual(2);
  });

  it('allows overwriting the title element type', () => {
    const wrapper = factory({ ...testProps, titleTag: 'h4' });

    const titleElement = wrapper.findAll('h4');
    expect(titleElement.exists()).toEqual(true);
  });
});

