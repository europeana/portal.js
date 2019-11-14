import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import EntityField from '../../../../components/record/EntityField.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => mount(EntityField, {
  localVue,
  mocks: {
    localePath: () => 'localizedPath'
  }
});

describe('components/record/EntityField', () => {
  const wrapper = factory();
  describe('when it represents a Europeana Entity', () => {
    it('shows linked entity', () => {
      const props = { value: 'Painting', about: 'http://data.europeana.eu/concept/base/47' };

      wrapper.setProps(props);
      const fieldValue = wrapper.find('span a');
      fieldValue.attributes().href.should.eq('localizedPath');
      fieldValue.text().should.eq('Painting');
    });
  });

  describe('when it represents a provider entity', () => {
    it('shows just the label', () => {
      const props = { value: 'Painting', about: 'http://example.org/entities/painting' };

      wrapper.setProps(props);
      const fieldValue = wrapper.find('span');
      fieldValue.text().should.eq('Painting');
    });
  });
});
