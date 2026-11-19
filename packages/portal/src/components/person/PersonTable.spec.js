import { createLocalVue, shallowMount } from '@vue/test-utils';
import PersonTable from '@/components/person/PersonTable.vue';

const localVue = createLocalVue();

const testProps = {
  items: [
    {
      name: 'Jane Doe',
      country: 'The Netherlands',
      communities: ['Research', 'Education', 'Communicators', 'Impact'],
      contact: {
        email: 'example@org.eu',
        url: 'https://www.linkedin.com/profile'
      }
    },
    {
      name: 'John Doe',
      country: 'Belgium',
      communities: ['Research'],
      contact: { url: 'https://www.linkedin.com/profile' }
    },
    {
      name: 'Jane Doe',
      country: 'The Netherlands',
      communities: null,
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
  it('displays a table with name, country, communities and contact fields', () => {
    const wrapper = factory();

    expect(wrapper.find('table').isVisible()).toBe(true);
    expect(wrapper.find('.table-name-cell').isVisible()).toBe(true);
    expect(wrapper.find('.table-country-cell').isVisible()).toBe(true);
    expect(wrapper.find('.table-communities-cell').isVisible()).toBe(true);
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
    it('displays communities and contact fields in a row as details', () => {
      const wrapper = factory();

      expect(wrapper.find('.table-communities-cell').classes()).toEqual(expect.arrayContaining(['d-none', 'd-lg-table-cell']));
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

  describe('when countries prop is set', () => {
    it('renders countries filter dropdown of type radio', () => {
      const countries = ['France', 'United Kingdom'];
      const wrapper = factory({ ...testProps, countries });

      const countryDropdown = wrapper.findAll('searchdropdown-stub').at(0);

      expect(countryDropdown.isVisible()).toBe(true);
      expect(countryDropdown.attributes('name')).toEqual('country');
      expect(countryDropdown.attributes('type')).toEqual('radio');
      expect(countryDropdown.attributes('fields')).toEqual(countries.join(','));
      expect(countryDropdown.attributes('placeholder')).toEqual('pages.enaMembers.table.allCountries');
    });
    describe('when showDropdown is called', () => {
      it('emits showDropdown with the filter name', () => {
        const countries = ['France', 'United Kingdom'];
        const wrapper = factory({ ...testProps, countries });

        wrapper.find('searchdropdown-stub').vm.$emit('showDropdown');

        expect(wrapper.emitted('showDropdown')[0][0]).toBe('country');
      });
    });
  });
  describe('when communities prop is set', () => {
    it('renders communities filter dropdown of type checkbox', () => {
      const communities = ['Research', 'Education'];
      const wrapper = factory({ ...testProps, communities });

      const communitiesDropdown = wrapper.findAll('searchdropdown-stub').at(1);

      expect(communitiesDropdown.isVisible()).toBe(true);
      expect(communitiesDropdown.attributes('name')).toEqual('communities');
      expect(communitiesDropdown.attributes('type')).toEqual('checkbox');
      expect(communitiesDropdown.attributes('fields')).toEqual(communities.join(','));
      expect(communitiesDropdown.attributes('placeholder')).toEqual('pages.enaMembers.table.allCommunities');
    });
  });
});
