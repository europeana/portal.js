import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import EntityInformationModal from '@/components/entity/EntityInformationModal.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData = {}) => mount(EntityInformationModal, {
  localVue,
  propsData,
  mocks: {
    $t: (val) => val
  }
});

const info = [
  { label: 'Website', value: 'https://www.deutsche-digitale-bibliothek.de' },
  { label: 'Country', value: 'Germany' },
  { label: 'Name acronym', value: 'DDB', lang: 'de' },
  { label: 'City', value: 'Frankfurt am Main' }
];

const entityProps = {
  modalStatic: true,
  title: { values: ['Europeana'], code: 'en' },
  entityInfo: info
};

describe('components/entity/EntityInformationModal', () => {
  it('shows a title', () => {
    const wrapper = factory(entityProps);

    expect(wrapper.find('h5.modal-title').text()).toBe('Europeana');
    expect(wrapper.find('h5.modal-title span').attributes('lang')).toBe('en');
  });

  it('shows each info field with the corresponding label', () => {
    const wrapper = factory(entityProps);
    Object.keys(info).forEach((key) => {
      const infoField = wrapper.find(`ul li[data-qa="${info[key].label} field"]`);
      expect(infoField.text()).toContain(info[key].label);
      expect(infoField.text()).toContain(info[key].value);
    });
  });

  it('links to the organisation URL for the website', () => {
    const wrapper = factory(entityProps);

    const websiteLink = wrapper.find('ul li[data-qa="Website field"] a');
    expect(websiteLink.attributes().href).toEqual('https://www.deutsche-digitale-bibliothek.de');
  });
});
