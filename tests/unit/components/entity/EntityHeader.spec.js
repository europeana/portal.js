import { createLocalVue, shallowMount, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import EntityHeader from '@/components/entity/EntityHeader.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.directive('masonry-tile', {});

const shallowFactory = (propsData = {}) => shallowMount(EntityHeader, {
  localVue,
  propsData,
  mocks: {
    $t: (val) => val
  }
});

const factory = (propsData = {}) => mount(EntityHeader, {
  localVue,
  propsData,
  mocks: {
    $t: (val) => val,
    $redrawVueMasonry: () => true
  }
});

const moreData = {
};


const entityProps = {
  title: { values: ['Book'], code: 'en' },
  description: { values: ['Architecture is both the process and the product of planning, designing, and constructing buildings and other physical structures.'], code: 'en' },
  logo: 'https://www.example.eu/logo.svg',
  image: 'https://www.example.eu/image.jpg',
  editable: false,
  externalLink: 'https://www.example.eu/',
  moreData: moreData
};

describe('components/entity/EntityHeaders', () => {
  it('shows a title and description', () => {
    const wrapper = shallowFactory(entityProps);

    expect(wrapper.find('[data-qa="entity title"]').text()).toBe('Book');
    expect(wrapper.find('[data-qa="entity title"]').attributes('lang')).toBe('en');
    expect(wrapper.find('[data-qa="entity description"]').text()).toBe(entityProps.description.values[0]);
  });

  it('does not show a show more button', () => {
    const wrapper = shallowFactory(entityProps);
    expect(wrapper.findAll('b-button-stub[data-qa="entity show link"]').length).toBe(0);
  });

  it('shows a show more button', () => {
    const longDescription = entityProps.description.values[0] + entityProps.description.values[0] + entityProps.description.values[0];
    const wrapper = shallowFactory({ description: { values: [longDescription], code: 'en' }, title: entityProps.title });

    expect(wrapper.findAll('b-button-stub[data-qa="entity show link"]').length).toBe(1);
  });

  it('shows the whole description when it is toggled on', () => {
    const longDescription = entityProps.description.values[0] + entityProps.description.values[0] + entityProps.description.values[0];
    const wrapper = factory({ description: { values: [longDescription], code: 'en' }, title: entityProps.title });
    const button = wrapper.find('button[data-qa="entity show link"]');
    button.trigger('click');
    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('[data-qa="entity description"]').text()).toBe(longDescription);
    });
  });

  it('shows a logo', () => {
    const wrapper = shallowFactory(entityProps);

    const logo = wrapper.find('[data-qa="entity logo"]');
    const resizedLogo = wrapper.vm.resizedLogo;

    expect(logo.exists()).toBe(true);
    expect(logo.attributes('style')).toBe(`background-image: url(${resizedLogo});`);
  });

  it('shows a learn more button', () => {
    // This test doesn't confirm that the button opens the modal.
    const wrapper = shallowFactory(entityProps);

    const learnMoreButton = wrapper.find('[data-qa="entity details button"]');

    expect(learnMoreButton.exists()).toBe(true);
  });

  it('has a more info modal', () => {
    // This test doesn't confirm that the modal works, just that it exists.
    const wrapper = shallowFactory(entityProps);

    const moreInfoModal = wrapper.find('#entityInformationModal');

    expect(moreInfoModal.exists()).toBe(true);
  });

  describe('editing when it is enabled', ()=> {
    entityProps.editable = true;
    it('shows an edit button', () => {
      // This test doesn't confirm that the button opens the modal.
      const wrapper = shallowFactory(entityProps);

      const editButton = wrapper.find('[data-qa="entity edit button"]');

      expect(editButton.exists()).toBe(true);
    });

    it('has an edit modal', () => {
      // This test doesn't confirm that the modal works, just that it exists.
      const wrapper = shallowFactory(entityProps);

      const editModal = wrapper.find('#entityUpdateModal');

      expect(editModal.exists()).toBe(true);
    });
  });
});
