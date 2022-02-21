import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import EntityHeader from '@/components/entity/EntityHeader.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData = {}) => shallowMount(EntityHeader, {
  localVue,
  propsData,
  mocks: {
    $t: (val) => val
  }
});

const entityProps = {
  title: { values: ['Book'], code: 'en' },
  description: { values: ['Architecture is both the process and the product of planning, designing, and constructing buildings and other physical structures.'], code: 'en' },
  descriptionText: 'Architecture is both the process and the product of planning, designing, and constructing buildings and other physical structures.',
  logo: 'https://www.example.eu/logo.svg',
  image: 'https://www.example.eu/image.jpg',
  editable: false,
  externalLink: 'https://www.example.eu/'

};

describe('components/entity/EntityHeasders', () => {
  it('shows a title and description', () => {
    const wrapper = factory(entityProps);

    expect(wrapper.find('[data-qa="entity title"]').text()).toBe('Book');
    expect(wrapper.find('[data-qa="entity title"]').attributes('lang')).toBe('en');
    expect(wrapper.find('[data-qa="entity description"]').text()).toBe(entityProps.description.values[0]);
  });

  it('does not show a show more button', () => {
    const wrapper = factory(entityProps);
    expect(wrapper.findAll('b-button-stub[data-qa="entity show link"]').length).toBe(0);
  });

  it('shows a show more button', () => {
    const longDescription = entityProps.description.values[0] + entityProps.description.values[0] + entityProps.description.values[0];
    const wrapper = factory({ description: { values: [longDescription], code: 'en' }, title: entityProps.title });

    console.log(wrapper.vm.fullDescription.length);

    expect(wrapper.findAll('b-button-stub[data-qa="entity show link"]').length).toBe(1);
  });

  it('shows a logo', () => {
    const wrapper = factory(entityProps);

    const logo = wrapper.find('[data-qa="entity logo"]');
    const resizedLogo = wrapper.vm.resizedLogo;

    expect(logo.exists()).toBe(true);
    expect(logo.attributes('style')).toBe(`background-image: url(${resizedLogo});`);
  });
});
