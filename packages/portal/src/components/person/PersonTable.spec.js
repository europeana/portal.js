import { createLocalVue, shallowMount } from '@vue/test-utils';
import PersonTable from '@/components/person/PersonTable.vue';

const localVue = createLocalVue();

const testProps = {
  items: [
    {
      name: 'Jane Doe',
      country: 'The Netherlands',
      community: ['Research', 'Education', 'Communicators', 'Impact'],
      contact: {
        email: 'example@org.eu',
        url: 'https://www.linkedin.com/profile'
      }
    },
    {
      name: 'John Doe',
      country: 'Belgium',
      community: ['Research'],
      contact: { url: 'https://www.linkedin.com/profile' }
    },
    {
      name: 'Jane Doe',
      country: 'The Netherlands',
      community: null,
      contact: { email: null, url: null }
    }
  ]
};

const factory = (propsData = testProps) =>
  shallowMount(PersonTable, {
    localVue,
    propsData,
    mocks: {
      $t: (key) => key
    }
  });

describe('components/content/PersonTable', () => {
  it('displays a table with name, country, community and contact fields', () => {
    const wrapper = factory();

    expect(wrapper.find('table').isVisible()).toBe(true);
    expect(wrapper.find('.table-name-cell').isVisible()).toBe(true);
    expect(wrapper.find('.table-country-cell').isVisible()).toBe(true);
    expect(wrapper.find('.table-community-cell').isVisible()).toBe(true);
    expect(wrapper.find('.table-contact-cell').isVisible()).toBe(true);
  });

  describe('when perPage prop is set', () => {
    it('renders pagination', () => {
      const wrapper = factory();

      expect(wrapper.find('paginationnavinput-stub').exists()).toBe(true);
    });
  });

  describe('when there are no people', () => {
    it('does not render a table', () => {
      const wrapper = factory({});

      expect(wrapper.find('table').exists()).toBe(false);
    });
  });

  describe('on small screens', () => {
    it('displays community and contact fields in a row as details', () => {
      const wrapper = factory();

      expect(wrapper.find('.table-community-cell').classes()).toEqual(expect.arrayContaining(['d-none', 'd-lg-table-cell']));
      expect(wrapper.find('.table-contact-cell').classes()).toEqual(expect.arrayContaining(['d-none', 'd-lg-table-cell']));
    });
  });

  describe('toggleDetails', () => {
    it('toggles the display of the details row', () => {
      const wrapper = factory();

      expect(wrapper.vm.people[0].showDetails).toBe(false);

      wrapper.vm.toggleDetails(wrapper.vm.people[0]);

      expect(wrapper.vm.people[0].showDetails).toBe(true);
    });
  });
});
